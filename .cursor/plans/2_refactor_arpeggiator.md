---
name: Refactor Arpeggiator Scheduling
overview: Propagate the precise audio-clock time from the arpeggiator scheduler through the callback and instrument/voice layers so that note-on, note-off, and gate timing use Web Audio sample-accurate scheduling instead of firing immediately or relying on setTimeout.
todos:
  - id: arp-scheduleNote
    content: Refactor _scheduleNote to pass `time` through callback and replace setTimeout gate with pre-scheduled note-off
    status: pending
  - id: arp-stop
    content: Update _stop to properly cancel pre-scheduled note-offs
    status: pending
  - id: daw-callback
    content: Update _setupArpeggiatorCallback in daw.js to forward `time` in parsed object
    status: pending
  - id: instrument-time
    content: Thread `time` through instrument.js onMidiMessage/onNoteOn/onNoteOff
    status: pending
  - id: voice-time
    content: Thread `time` through voice.js to gainEnvelope.start/end and filterEnvelope.start/end
    status: pending
isProject: false
---

# Refactor Arpeggiator to Use Sample-Accurate Web Audio Scheduling

## Problem

The arpeggiator's `_scheduler` loop correctly uses the "lookahead" pattern (setTimeout + audioContext.currentTime), but the actual note triggering discards the precise `time`:

- **Note-on** fires immediately via `noteCallback(freq, velocity, true)` instead of at the scheduled `time`
- **Note-off (gate)** uses a second `setTimeout` instead of scheduling at `time + gateDuration`

This causes ~25ms jitter on note-on and additional jitter on note-off — very audible at fast rates (1/16 at 120 BPM = 125ms per note).

## Key Insight: Envelope Already Supports `time`

The existing Envelope class (in `viktor-nv1-engine`) already accepts an optional `time` parameter on both `start(upperBoundMultiplier, time)` and `end(time)`, defaulting to `audioContext.currentTime` if omitted. This means the deepest layer is already prepared — we just need to thread `time` through the intermediate layers.

## Changes (all in `viktor-nv1-engine`)

### 1. Arpeggiator: pass `time` through callback, remove `setTimeout` for gate

In `arpeggiator.js`:

- Change `noteCallback` signature to `noteCallback(freq, velocity, isNoteOn, time)`
- In `_scheduleNote(time)`: pass `time` to the note-on callback call
- Replace the `setTimeout`-based gate note-off with a direct callback call using `time + gateDuration`
- Remove `currentlyPlayingNote` tracking (no longer needed since note-off is pre-scheduled)

```javascript
_scheduleNote: function( time ) {
    // ... existing note selection, velocity, duration logic ...

    noteCallback( freq, velocity, true, time );
    noteCallback( freq, 0, false, time + gateDuration );
}
```

### 2. DAW: forward `time` in the arpeggiator callback

In `daw.js` `_setupArpeggiatorCallback`:

- Accept `time` from the arpeggiator callback
- Pass it through to `instrument.onMidiMessage` in the `parsed` object as a new `time` field

### 3. Instrument: forward `time` to voice

In `instrument.js`:

- `onMidiMessage` / `onNoteOn` / `onNoteOff`: accept and forward `time`

### 4. Voice: pass `time` to envelope start/end

In `voice.js`:

- `onMidiMessage`: extract `time` from `parsed` and pass to `onNoteOn` / `onNoteOff`
- `onNoteOn(noteFrequency, velocity, time)`: pass `time` to `gainEnvelope.start(attackPeak, time)` and `filterEnvelope.start(attackPeak, time)`
- `onNoteOff(noteFrequency, velocity, time)`: pass `time` to `gainEnvelope.end(time)` and `filterEnvelope.end(time)`

### 5. Arpeggiator `_stop`: schedule note-off at precise time

In `_stop()`, the cleanup note-off for the currently playing note should also use `audioContext.currentTime` rather than firing synchronously. Since we're moving to pre-scheduled note-offs, `_stop` needs to cancel any future scheduled events and send an immediate cleanup note-off at `audioContext.currentTime`.

## Data Flow (before vs after)

```mermaid
flowchart LR
    subgraph before [Before]
        S1[Scheduler] -->|"calls immediately"| CB1[noteCallback]
        CB1 --> I1[Instrument]
        I1 --> V1[Voice]
        V1 -->|"envelope.start(peak)"| E1["Envelope (uses currentTime)"]
        ST1["setTimeout(gateDuration)"] -->|"calls immediately"| CB2[noteCallback off]
    end

    subgraph after [After]
        S2[Scheduler] -->|"passes time"| CB3["noteCallback(freq, vel, on, time)"]
        CB3 --> I2[Instrument]
        I2 --> V2[Voice]
        V2 -->|"envelope.start(peak, time)"| E2["Envelope (uses time)"]
        S2 -->|"passes time+gate"| CB4["noteCallback(freq, vel, off, time+gate)"]
    end
```

## What Does NOT Change

- The `_scheduler` setTimeout/lookahead loop — this is the correct pattern
- The `scheduleAheadTime` and `lookahead` constants
- The Envelope class internals (already supports `time`)
- Non-arpeggiator MIDI path (live keyboard playing continues to use `audioContext.currentTime` via the default)
- No changes needed in the `viktor` repo itself — all engine changes are in `viktor-nv1-engine`

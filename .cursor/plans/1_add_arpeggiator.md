---
name: NV-1 Arpeggiator UI
overview: Add arpeggiator UI to Viktor NV-1 by optimizing the existing 1200x600px panel layout — reshuffling modules, integrating noise into mixer, and adding the ARP module with BPM control.
todos:
  - id: design-ui
    content: Generate optimized UI design using specialized tool with the brief
    status: completed
  - id: create-arp-ui
    content: Create arpeggiator Angular module (controller + template)
    status: completed
  - id: update-synth-layout
    content: Modify synth templates to integrate noise into mixer, add ARP
    status: completed
  - id: add-bpm-control
    content: Add BPM/tempo control to bottom row UI
    status: completed
  - id: create-sprites
    content: Create new knob sprites and direction button icons
    status: completed
  - id: update-styles
    content: Add arpeggiator.styl and update layout styles
    status: completed
isProject: false
---

# NV-1 Arpeggiator — UI

## Layout Optimization (Fit on Existing 1200px Panel)

### Current Layout Analysis

The existing panel uses Bootstrap 12-column grid. Current allocation:

| Module                 | Columns      | Notes                 |
| ---------------------- | ------------ | --------------------- |
| Modulation + Polyphony | 1 + 1 offset | Stacked vertically    |
| Oscillator Bank        | 2            | 3 oscillators         |
| Mixer                  | 2            | 3 rows                |
| Noise                  | 1            | Compact               |
| Envelopes              | 2            | Primary + Filter ADSR |
| LP Filter              | 1            | 3 knobs stacked       |
| LFO                    | 1            | 3 knobs stacked       |
| **Total**              | **11 cols**  | 1 col unused          |

### Space Recovery Strategy

To fit the ARP module (~2 columns needed):

1. **Remove the 1-column offset** from Modulation+Polyphony (+1 col)
2. **Merge Oscillator Bank + Mixer** into a combined module (save ~1 col)
3. **Compact the Noise module** - integrate into Mixer or reduce to minimal controls
4. **Stack LFO + ARP vertically** in a shared 2-column space

### Proposed Optimized Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Settings]                    [Patch Library - compact]                    │
├────┬──────────────┬──────────┬──────────┬────────┬─────────────────────────┤
│MOD │  OSCILLATORS │  MIXER   │ENVELOPES │ FILTER │    LFO + ARP            │
│POLY│  + NOISE     │          │          │        │                         │
│    │              │          │          │        │ ┌─────┐ ┌─────────────┐ │
│Form│ O1: Rng Wave │ 1○ ──○   │ Primary  │Cutoff  │ │ LFO │ │ARPEGGIATOR │ │
│Glid│ O2: Rng Wave │ 2○ ──○   │ A D S R  │        │ │Form │ │[ON][HOLD]  │ │
│    │ O3: Rng Wave │ 3○ ──○   │          │Emph    │ │Rate │ │[RST]       │ │
│Voic│    Det  Det  │ N○ ──○   │ Filter   │        │ │Amt  │ │↑ ↓ ↕ ⇅ ?  │ │
│    │              │          │ A D S R  │Env     │ └─────┘ │Rate Rng    │ │
│    │              │          │          │        │         │Gate Scl Vel│ │
│    │              │          │          │        │         └─────────────┘ │
├────┴──────────────┴──────────┴──────────┴────────┴─────────────────────────┤
│[Pitch][Mod]│ COMPRESSOR │ DELAY │ REVERB │              │ MASTER │ BPM    │
├────────────┴────────────┴───────┴────────┴──────────────┴────────┴────────┤
│                              KEYBOARD                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Column Allocation (12 columns)

- Modulation + Polyphony: **1 col** (no offset)
- Oscillators (with integrated noise row): **2 cols**
- Mixer: **2 cols** (includes noise on/off + level)
- Envelopes: **2 cols**
- Filter: **1 col**
- LFO: **1 col** (compact, stacked)
- Arpeggiator: **2 cols** (new)
- Remaining: **1 col** (absorbed into spacing)

### Key UI Changes

1. **Noise Integration**: Add noise as 4th row in Mixer (On/Off + Level only, remove Type slider or make it a 2-pos switch)
2. **Remove Modulation offset**: Shift everything left
3. **LFO Compaction**: Keep 3 knobs stacked vertically in 1 column
4. **ARP Module**: 2 columns, positioned next to LFO

### ARP Module UI Specification (2 columns)

**Top Section (Buttons)**:

- Row 1: ARP (on/off), HOLD, RESET - 3 toggle buttons with LEDs
- Row 2: Direction bank - 5 small buttons (↑ ↓ ↕ ⇅ ?)

**Bottom Section (Knobs)** - 2 rows of 3 small knobs:

- Row 1: RATE (stepped), RANGE (stepped), GATE (continuous)
- Row 2: SCALE (stepped), VEL SLOPE (bipolar), [empty or BPM moved here]

**BPM Placement Options**:

- Option A: Bottom row near Master Volume (performance area)
- Option B: Inside ARP module (since ARP needs tempo)
- Option C: Near Polyphony (global settings)

## Files

| File                                                                        | Action                                      |
| --------------------------------------------------------------------------- | ------------------------------------------- |
| `src/app/ui/module/instruments/synth/arpeggiator/`                          | **Create** - New module folder              |
| `src/app/ui/module/instruments/synth/arpeggiator/controller/arpeggiator.js` | **Create**                                  |
| `src/app/ui/module/instruments/synth/arpeggiator/template/arpeggiator.html` | **Create**                                  |
| `src/app/ui/module/instruments/synth/arpeggiator/module.js`                 | **Create**                                  |
| `src/app/ui/module/instruments/synth/module.js`                             | **Modify** - Include arpeggiator module     |
| `src/app/ui/module/instruments/synth/template/synth.html`                   | **Modify** - Add `<arpeggiator>`            |
| `src/app/ui/module/instruments/synth/template/mixer.html`                   | **Modify** - Add noise row                  |
| `src/app/ui/module/instruments/synth/template/noise.html`                   | **Remove** or simplify                      |
| `src/app/ui/module.js`                                                      | **Modify** - Add tempo/BPM controls         |
| `src/client/styles/daw/synth/arpeggiator.styl`                              | **Create**                                  |
| `src/client/images/`                                                        | **Add** - New knob sprites, direction icons |

## UI Design Brief

```
# NV-1 Synth UI Optimization Brief

## Constraint
Fit all controls on existing 1200x600px panel. No panel size increase.

## Changes from Current
1. Remove left offset from Modulation+Polyphony module
2. Integrate Noise into Mixer as 4th row (On/Off + Level only)
3. Add Arpeggiator module (2 columns) next to LFO
4. Add BPM control in bottom row near Master Volume
5. Compact all modules slightly to fit

## New ARP Module Layout (2 columns wide)
Top: [ARP] [HOLD] [RESET] buttons with LEDs
Middle: [↑] [↓] [↕] [⇅] [?] direction buttons
Bottom: 6 small knobs in 2 rows:
  - RATE, RANGE, GATE
  - SCALE, VEL SLOPE, (empty or label)

## Style
- Same hardware aesthetic as current
- No menus, no displays
- All controls always visible
- LED indicators for toggle states
- Consistent knob sizes (45px for ARP knobs)
```

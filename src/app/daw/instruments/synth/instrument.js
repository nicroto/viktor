/* jshint -W098 */

'use strict';

function Instrument( audioContext, settings ) {
	var self = this,
		oscillator = audioContext.createOscillator(),
		envelope = audioContext.createGain(),
		customOrDefault = function( customValue, defaultValue ) {
			return customValue !== undefined ? customValue : defaultValue;
		};

	settings = settings ? settings : {};

	oscillator.frequency.setValueAtTime( 110, 0 );
	envelope.gain.value = 0.0;

	oscillator.connect( envelope );
	oscillator.start( 0 );

	self.audioContext = audioContext;
	self.oscillatorNode = oscillator;
	self.envelopeNode = envelope;
	self.outputNode = envelope;
	self.activeNotes = [];
	self.settings = {
		attackTime: customOrDefault( settings.attackTime, 0.05 ),
		releaseTime: customOrDefault( settings.releaseTime, 0.05 ),
		portamento: customOrDefault( settings.portamento, 0.05 )
	};
}

Instrument.prototype = {

	onMidiMessage: function( eventType, parsed, rawEvent ) {
		var self = this;

		if ( eventType === "notePress" ) {
			var methodName = ( parsed.isNoteOn ) ? "onNoteOn" : "onNoteOff";

			self[ methodName ]( parsed.noteFrequency, parsed.velocity );
		}
	},

	onNoteOn: function( noteFrequency, velocity ) {
		var self = this,
			oscillator = self.oscillatorNode,
			envelope = self.envelopeNode,
			activeNotes = self.activeNotes,
			settings = self.settings;

		activeNotes.push( noteFrequency );

		oscillator.frequency.cancelScheduledValues( 0 );
		oscillator.frequency.setTargetAtTime(
			noteFrequency,
			0,
			settings.portamento
		);

		envelope.gain.cancelScheduledValues( 0 );
		envelope.gain.setTargetAtTime( 1.0, 0, settings.attackTime );
	},

	onNoteOff: function( noteFrequency, velocity ) {
		var self = this,
			oscillator = self.oscillatorNode,
			envelope = self.envelopeNode,
			activeNotes = self.activeNotes,
			settings = self.settings,
			position = activeNotes.indexOf( noteFrequency );

		if ( position !== -1 ) {
			activeNotes.splice( position, 1 );
		}

		if ( activeNotes.length === 0 ) {
			envelope.gain.cancelScheduledValues( 0 );
			envelope.gain.setTargetAtTime( 0.0, 0, settings.releaseTime );
		} else {
			oscillator.frequency.cancelScheduledValues( 0 );
			oscillator.frequency.setTargetAtTime(
				activeNotes[ activeNotes.length - 1 ],
				0,
				settings.portamento
			);
		}
	}

};

module.exports = Instrument;
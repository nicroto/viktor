'use strict';

var CONST = require( "./const" );

function LFO( audioContext, controlledNode, propName, settings ) {
	var self = this,
		oscillator = audioContext.createOscillator(),
		gain = audioContext.createGain();

	if ( !settings || !settings.rate || !( settings.defaultForm || settings.customFormFFT ) ) {
		throw new Error( "Bad settings." );
	}

	Object.defineProperty( self, "rate", {
		set: function( value ) {
			var self = this;

			self.oscillator.frequency.value = value;
		}
	} );

	Object.defineProperty( self, "waveform", {
		set: function( value ) {
			var self = this,
				audioContext = self.audioContext,
				oscillator = self.oscillator,
				defaultForm = value.defaultForm,
				customFormFFT = value.customFormFFT;

			if ( defaultForm ) {
				oscillator.type = defaultForm;
			} else {
				var waveTable = audioContext.createPeriodicWave(
					customFormFFT.real,
					customFormFFT.imag
				);

				oscillator.setPeriodicWave( waveTable );
			}
		}
	} );

	gain.gain.value =
	controlledNode[ propName ].value = CONST.LFO_DEFAULT_FREQUENCY_RANGE;

	oscillator.connect( gain );
	gain.connect( controlledNode[ propName ] )

	self.audioContext = audioContext;
	self.oscillator = oscillator;

	self.rate = settings.rate;
	self.waveform = settings;

	oscillator.start( 0 );
}

module.exports = LFO;
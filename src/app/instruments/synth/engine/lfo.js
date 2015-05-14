'use strict';

var DEFAULT_FREQUENCY_RANGE = 500;

function LFO( audioContext, controlledNodes, propName, settings ) {
	var self = this,
		oscillator = audioContext.createOscillator(),
		gain = audioContext.createGain();

	if ( !settings || settings.rate === undefined || !( settings.defaultForm || settings.customFormFFT ) ) {
		throw new Error( "Bad settings." );
	}

	self.propName = propName;
	self.controlledNodes = controlledNodes;
	self.settings = settings;
	self.audioContext = audioContext;
	self.oscillator = oscillator;
	self.gain = gain;

	self._defineProps();

	self.rate = settings.rate;
	self.waveform = settings;

	self._initCenterFrequency();
	self._initFrequencyRange();

	oscillator.connect( gain );
	controlledNodes.forEach( function( node ) {
		gain.connect( node[ propName ] );
	} );

	oscillator.start( 0 );
}

LFO.prototype = {

	_defineProps: function() {
		var self = this;

		Object.defineProperty( self, "rate", {
			set: function( value ) {
				var self = this,
					gain = self.gain;

				if ( value === 0 ) {
					gain.gain.value = 0;
				} else if ( gain.gain.value === 0 ) {
					self._initFrequencyRange();
				}

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
	},

	_initCenterFrequency: function() {
		var self = this,
			controlledNodes = self.controlledNodes,
			settings = self.settings,
			propName = self.propName;

		if ( settings.centerFrequency ) {
			controlledNodes.forEach( function( node ) {
				node[ propName ].value = settings.centerFrequency;
			} );
		}
	},

	_initFrequencyRange: function() {
		var self = this,
			gain = self.gain,
			settings = self.settings;

		gain.gain.value = settings.frequencyRange ?
			settings.frequencyRange : DEFAULT_FREQUENCY_RANGE;
	}

};

module.exports = LFO;
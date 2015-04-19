/* jshint -W098 */

'use strict';

var utils = require( "./logic/utils" );

function Instrument( audioContext, settings ) {
	var self = this,
		oscillators = [],
		envelope = audioContext.createGain(),
		customOrDefault = function( customValue, defaultValue ) {
			return customValue !== undefined ? customValue : defaultValue;
		};

	settings = settings ? settings : {};

	while ( oscillators.length < 3 ) {
		var osc = audioContext.createOscillator();

		osc.frequency.setValueAtTime( 110, 0 );
		osc.connect( envelope );
		osc.start( 0 );

		oscillators.push( osc );
	}

	envelope.gain.value = 0.0;

	self.audioContext = audioContext;
	self.oscillators = oscillators;
	self.envelopeNode = envelope;
	self.outputNode = envelope;
	self.activeNotes = [];
	self.settings = {
		attackTime: customOrDefault( settings.attackTime, 0.05 ),
		releaseTime: customOrDefault( settings.releaseTime, 0.05 ),
		portamento: customOrDefault( settings.portamento, 0.05 ),

		oscillators: null
	};

	self._defineProps();

	self.oscillatorSettings = {
		osc1: {
			range: 3,
			waveform: 0
		},
		osc2: {
			range: 3,
			fineDetune: 8,
			waveform: 0
		},
		osc3: {
			range: 3,
			fineDetune: 8,
			waveform: 0
		}
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
			envelope = self.envelopeNode,
			activeNotes = self.activeNotes,
			settings = self.settings;

		activeNotes.push( noteFrequency );

		self.oscillators.forEach( function( osc ) {
			self._setNoteToOscillator( noteFrequency, settings, osc );
		} );

		envelope.gain.cancelScheduledValues( 0 );
		envelope.gain.setTargetAtTime( 1.0, 0, settings.attackTime );
	},

	onNoteOff: function( noteFrequency, velocity ) {
		var self = this,
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
			noteFrequency = activeNotes[ activeNotes.length - 1 ];

			self.oscillators.forEach( function( osc ) {
				self._setNoteToOscillator( noteFrequency, settings, osc );
			} );
		}
	},

	_defineProps: function() {
		var self = this;

		Object.defineProperty( self, "oscillatorSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.oscillators ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.oscillators,
					oscillators = self.oscillators,
					osc1 = oscillators[ 0 ],
					osc2 = oscillators[ 1 ],
					osc3 = oscillators[ 2 ],
					oscSettings1 = settings.osc1,
					oscSettings2 = settings.osc2,
					oscSettings3 = settings.osc3;

				if ( oldSettings ) {
					var oldOscSettings1 = oldSettings.osc1,
						oldOscSettings2 = oldSettings.osc2,
						oldOscSettings3 = oldSettings.osc3,
						resolveRange = function( oldSettings, settings, osc ) {
							if ( oldSettings.range !== settings.range ) {
								osc.detune.value = utils.getDetune(
									settings.range,
									8
								);
							}
						},
						resolveWaveform = function( oldSettings, settings, osc ) {
							if ( oldSettings.waveform !== settings.waveform ) {
								var defaultForm = utils.OSC_WAVEFORM[ settings.waveform ];

								if ( defaultForm ) {
									osc.type = defaultForm;
								} else {
									var waveformFFT = utils.OSC_WAVEFORM_FFT[ settings.waveform - utils.OSC_WAVEFORM.length ];

									if ( waveformFFT ) {
										var audioContext = self.audioContext,
											fft = waveformFFT.fft,
											size = fft.real.length,
											real = new Float32Array( size ),
											imag = new Float32Array( size );

										for ( var i = 0; i < size; i++ ) {
											real[ i ] = fft.real[ i ];
											imag[ i ] = fft.imag[ i ];
										}

										var waveTable = audioContext.createPeriodicWave( real, imag );

										osc.setPeriodicWave( waveTable );
									}
								}
							}
						},
						resolveFineDetune = function( oldSettings, settings, osc, base ) {
							if ( oldSettings.range !== settings.range ||
								oldSettings.fineDetune !== settings.fineDetune )
							{
								osc.detune.value = utils.getDetune(
									settings.range,
									settings.fineDetune,
									base
								);
							}
						};

					resolveRange( oldOscSettings1, oscSettings1, osc1 );
					resolveWaveform( oldOscSettings1, oscSettings1, osc1 );

					resolveFineDetune( oldOscSettings2, oscSettings2, osc2 );
					resolveWaveform( oldOscSettings2, oscSettings2, osc2 );

					resolveFineDetune( oldOscSettings3, oscSettings3, osc3, utils.OSC3_RANGE_BASE );
					resolveWaveform( oldOscSettings3, oscSettings3, osc3 );
				}

				self.settings.oscillators = JSON.parse( JSON.stringify( settings ) );
			}

		} );
	},

	_setNoteToOscillator: function( noteFrequency, settings, oscillator ) {
		oscillator.frequency.cancelScheduledValues( 0 );
		oscillator.frequency.setTargetAtTime(
			noteFrequency,
			0,
			settings.portamento
		);
	}

};

module.exports = Instrument;
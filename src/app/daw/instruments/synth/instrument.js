/* jshint -W098 */

'use strict';

var utils = require( "./logic/utils" );

function Instrument( audioContext, settings ) {
	var self = this,
		volumes = [],
		oscillators = [],
		noiseVolume = audioContext.createGain(),
		noiseNode = audioContext.createScriptProcessor( utils.NOISE_BUFFER_SIZE, 1, 1 ),
		envelope = audioContext.createGain(),
		customOrDefault = function( customValue, defaultValue ) {
			return customValue !== undefined ? customValue : defaultValue;
		};

	settings = settings ? settings : {};

	envelope.gain.value = 0.0;

	while ( oscillators.length < 3 ) {
		var osc = audioContext.createOscillator(),
			volume = audioContext.createGain();

		volume.gain.value = 0.0;
		volume.connect( envelope );

		osc.frequency.setValueAtTime( 110, 0 );
		osc.connect( volume );
		osc.start( 0 );

		volumes.push( volume );
		oscillators.push( osc );
	}

	noiseVolume.gain.value = 0.0;
	noiseVolume.connect( envelope );

	self.audioContext = audioContext;
	self.volumes = volumes;
	self.oscillators = oscillators;
	self.noiseVolume = noiseVolume;
	self.noiseNode = noiseNode;
	self.envelopeNode = envelope;
	self.outputNode = envelope;
	self.activeNotes = [];
	self.settings = {
		attackTime: customOrDefault( settings.attackTime, 0.05 ),
		releaseTime: customOrDefault( settings.releaseTime, 0.05 ),

		modulation: null,
		oscillators: null,
		mixer: null
	};

	self._defineProps();

	self.modulationSettings = {
		portamento: 5,
		mix: 50
	};

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

	self.mixerSettings = {
		volume1: {
			isEnabled: 1,
			value: 60
		},
		volume2: {
			isEnabled: 0,
			value: 60
		},
		volume3: {
			isEnabled: 0,
			value: 60
		},
		noise: {
			type: 0,
			volume: 0,
			isEnabled: 0
		}
	};


	self._changeNoise( noiseNode, utils.NOISE_TYPE[ utils.DEFAULT_NOISE_TYPE ] );
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

		Object.defineProperty( self, "modulationSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.modulation ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.modulation;

				self.settings.modulation = JSON.parse( JSON.stringify( settings ) );
			}

		} );

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

		Object.defineProperty( self, "mixerSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.mixer ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.mixer,
					volumes = self.volumes,
					volume1 = volumes[ 0 ],
					volume2 = volumes[ 1 ],
					volume3 = volumes[ 2 ],
					noiseVolume = self.noiseVolume,
					noiseNode = self.noiseNode,
					volumeSettings1 = settings.volume1,
					volumeSettings2 = settings.volume2,
					volumeSettings3 = settings.volume3,
					noiseSettings = settings.noise,
					resolveVolume = function( settings, volume ) {
						var value = settings.isEnabled ? settings.value : 0;

						volume.gain.value = utils.getVolume( value );
					};

				resolveVolume( volumeSettings1, volume1 );
				resolveVolume( volumeSettings2, volume2 );
				resolveVolume( volumeSettings3, volume3 );

				if ( oldSettings ) {
					var oldNoiseSettings = oldSettings.noise;

					if ( noiseSettings.type !== oldNoiseSettings.type ) {
						self._changeNoise( noiseNode, utils.NOISE_TYPE[ noiseSettings.type ] );
					}

					if ( oldNoiseSettings.isEnabled && !noiseSettings.isEnabled ) {
						noiseNode.disconnect();
					} else if ( !oldNoiseSettings.isEnabled && noiseSettings.isEnabled ) {
						noiseNode.connect( noiseVolume );
					}

					noiseVolume.gain.value = utils.getVolume( noiseSettings.volume );
				}

				self.settings.mixer = JSON.parse( JSON.stringify( settings ) );
			}

		} );
	},

	_setNoteToOscillator: function( noteFrequency, settings, oscillator ) {
		oscillator.frequency.cancelScheduledValues( 0 );
		oscillator.frequency.setTargetAtTime(
			noteFrequency,
			0,
			utils.getPortamento( settings.modulation.portamento )
		);
	},

	_changeNoise: function( noiseNode, type ) {
		noiseNode.onaudioprocess = utils.getNoiseGenerator( type );
	}

};

module.exports = Instrument;
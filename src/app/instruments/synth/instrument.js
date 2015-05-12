/* jshint -W098 */

'use strict';

var settingsConvertor = require( "settings-convertor" ),
	CONST = require( "./engine/const" ),
	Envelope = require( "./engine/envelope" ),
	Filter = require( "./engine/filter" ),
	LFO = require( "./engine/lfo" ),
	Mix = require( "./engine/mix" );

function Instrument( audioContext ) {
	var self = this,
		volumes = [],
		oscillators = [],
		noiseVolume = audioContext.createGain(),
		noiseNode = audioContext.createScriptProcessor( CONST.NOISE_BUFFER_SIZE, 1, 1 ),
		gainEnvelope = new Envelope( audioContext, "gain", 1 ),
		gainEnvelopeNode = audioContext.createGain(),
		envelopeControlledFilter = new Filter( audioContext ),
		uiControlledFilter = new Filter( audioContext ),
		lfoControlledFilter = new Filter( audioContext ),

		envelopeFilterMix = new Mix( audioContext, uiControlledFilter.node, envelopeControlledFilter.node ),
		lfoFilterMix = new Mix( audioContext, envelopeFilterMix.output, lfoControlledFilter.node ),
		filterEnvelope = new Envelope( audioContext, "frequency", CONST.FILTER_FREQUENCY_UPPER_BOUND ),
		filterLfo = new LFO( audioContext, [ lfoControlledFilter.node ], "frequency", {
			rate: CONST.LFO_DEFAULT_RATE,
			defaultForm: CONST.LFO_DEFAULT_FORM,
			centerFrequency: CONST.LFO_DEFAULT_FREQUENCY_RANGE
		} ),
		masterVolume = audioContext.createGain();

	gainEnvelopeNode.gain.value = 0.0;
	gainEnvelope.node = gainEnvelopeNode;

	filterEnvelope.node = envelopeControlledFilter.node;

	masterVolume.gain.value = 1.0;

	while ( oscillators.length < 3 ) {
		var osc = audioContext.createOscillator(),
			volume = audioContext.createGain();

		volume.gain.value = 0.0;
		volume.connect( gainEnvelope.node );

		osc.frequency.setValueAtTime( 110, 0 );
		osc.connect( volume );
		osc.start( 0 );

		volumes.push( volume );
		oscillators.push( osc );
	}

	var modulationLfo = new LFO( audioContext, oscillators, "frequency", {
		rate: 0,
		defaultForm: CONST.LFO_DEFAULT_FORM,
		frequencyRange: CONST.MODULATION_LFO_FREQUENCY_RANGE
	} );

	noiseVolume.gain.value = 0.0;

	noiseVolume.connect( gainEnvelope.node );

	gainEnvelope.node.connect( envelopeControlledFilter.node );
	gainEnvelope.node.connect( uiControlledFilter.node );
	envelopeFilterMix.output.connect( lfoControlledFilter.node );
	lfoFilterMix.output.connect( masterVolume );

	self.audioContext = audioContext;
	self.volumes = volumes;
	self.oscillators = oscillators;
	self.modulationLfo = modulationLfo;
	self.noiseVolume = noiseVolume;
	self.noiseNode = noiseNode;
	self.gainEnvelope = gainEnvelope;
	self.envelopeControlledFilter = envelopeControlledFilter;
	self.uiControlledFilter = uiControlledFilter;
	self.lfoControlledFilter = lfoControlledFilter;
	self.envelopeFilterMix = envelopeFilterMix;
	self.filterLfo = filterLfo;
	self.lfoFilterMix = lfoFilterMix;
	self.filterEnvelope = filterEnvelope;
	self.outputNode = masterVolume;
	self.activeNotes = [];
	self.settings = {

		modulation: null,
		oscillators: null,
		mixer: null,
		envelopes: null,
		filter: null,
		lfo: null,
		pitch: null

	};

	self._defineProps();

	self.modulationSettings = CONST.DEFAULT_MOD_SETTINGS;
	self.oscillatorSettings = CONST.DEFAULT_OSC_SETTINGS;
	self.mixerSettings = CONST.DEFAULT_MIX_SETTINGS;
	self.envelopesSettings = CONST.DEFAULT_ENVELOPES_SETTINGS;
	self.filterSettings = CONST.DEFAULT_FILTER_SETTINGS;
	self.lfoSettings = CONST.DEFAULT_LFO_SETTINGS;
	self.pitchSettings = CONST.DEFAULT_PITCH_SETTINGS;

	self._changeNoise( noiseNode, CONST.NOISE_TYPE[ CONST.DEFAULT_NOISE_TYPE ] );
}

Instrument.prototype = {

	onMidiMessage: function( eventType, parsed, rawEvent ) {
		var self = this;

		if ( eventType === "notePress" ) {
			var methodName = ( parsed.isNoteOn ) ? "onNoteOn" : "onNoteOff";

			self[ methodName ]( parsed.noteFrequency, parsed.velocity );
		} else if ( eventType === "pitchBend" ) {
			self.onPitchBend( parsed.pitchBend );
		} else if ( eventType === "modulationWheel" ) {
			self.onModulationWheelTurn( parsed.modulation );
		}
	},

	onNoteOn: function( noteFrequency, velocity ) {
		var self = this,
			gainEnvelope = self.gainEnvelope,
			filterEnvelope = self.filterEnvelope,
			activeNotes = self.activeNotes,
			settings = self.settings,
			hasANoteDown = activeNotes.length > 0;

		if ( !hasANoteDown ) {
			self._detuneOscillators( self.oscillators, activeNotes, self.oscillatorSettings, self.pitchSettings );
		}

		activeNotes.push( noteFrequency );

		self.oscillators.forEach( function( osc ) {
			self._setNoteToOscillator( noteFrequency, settings, osc );
		} );

		gainEnvelope.start();
		filterEnvelope.start();
	},

	onNoteOff: function( noteFrequency, velocity ) {
		var self = this,
			gainEnvelope = self.gainEnvelope,
			filterEnvelope = self.filterEnvelope,
			activeNotes = self.activeNotes,
			settings = self.settings,
			position = activeNotes.indexOf( noteFrequency );

		if ( position !== -1 ) {
			activeNotes.splice( position, 1 );
		}

		if ( activeNotes.length === 0 ) {
			gainEnvelope.end();
			filterEnvelope.end();
		} else {
			noteFrequency = activeNotes[ activeNotes.length - 1 ];

			self.oscillators.forEach( function( osc ) {
				self._setNoteToOscillator( noteFrequency, settings, osc );
			} );
		}
	},

	onPitchBend: function( pitchBend ) {
		var self = this;

		self.pitchSettings = {
			bend: pitchBend
		};
	},

	onModulationWheelTurn: function( modulation ) {
		var self = this,
			oldSettings = self.modulationSettings,
			newRate = settingsConvertor.transposeValue( modulation, [ 0, 1 ], [ 0, 15 ] );

		if ( oldSettings.rate !== newRate ) {
			self.modulationSettings = {
				waveform: oldSettings.waveform,
				portamento: oldSettings.portamento,
				rate: newRate
			};
		}
	},

	_defineProps: function() {
		var self = this;

		Object.defineProperty( self, "pitchSettings", {

			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.pitch ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.pitch || {},
					hasANoteDown = self.activeNotes.length > 0;

				if ( hasANoteDown && oldSettings.bend !== settings.bend ) {
					self._detuneOscillators( self.oscillators, self.activeNotes, self.oscillatorSettings, settings );
				}

				self.settings.pitch = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "modulationSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.modulation ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.modulation,
					modulationLfo = self.modulationLfo;

				if ( !oldSettings || ( oldSettings.rate !== settings.rate ) ) {
					modulationLfo.rate = settings.rate;
				}

				if ( !oldSettings || ( oldSettings.waveform !== settings.waveform ) ) {
					modulationLfo.waveform = self._getWaveForm( settings.waveform );
				}

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
						pitchDetune = settingsConvertor.transposeValue( self.pitchSettings.bend, [ -1, 1 ], [ -200, 200 ] ),
						resolveRange = function( oldSettings, settings, pitchDetune, osc ) {
							if ( oldSettings.range !== settings.range ) {
								osc.detune.value = self._getDetune(
									settings.range,
									8
								) + pitchDetune;
							}
						},
						resolveWaveform = function( oldSettings, settings, osc ) {
							if ( oldSettings.waveform !== settings.waveform ) {
								var defaultForm = CONST.OSC_WAVEFORM[ settings.waveform ];

								if ( defaultForm ) {
									osc.type = defaultForm;
								} else {
									var waveformFFT = CONST.OSC_WAVEFORM_FFT[ settings.waveform - CONST.OSC_WAVEFORM.length ];

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
						resolveFineDetune = function( oldSettings, settings, pitchDetune, osc, base ) {
							if ( oldSettings.range !== settings.range ||
								oldSettings.fineDetune !== settings.fineDetune )
							{
								osc.detune.value = self._getDetune(
									settings.range,
									settings.fineDetune,
									base
								) + pitchDetune;
							}
						};

					resolveRange( oldOscSettings1, oscSettings1, pitchDetune, osc1 );
					resolveWaveform( oldOscSettings1, oscSettings1, osc1 );

					resolveFineDetune( oldOscSettings2, oscSettings2, pitchDetune, osc2 );
					resolveWaveform( oldOscSettings2, oscSettings2, osc2 );

					resolveFineDetune( oldOscSettings3, oscSettings3, pitchDetune, osc3, CONST.OSC3_RANGE_BASE );
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

						volume.gain.value = settingsConvertor.transposeValue( value, [ 0, 100 ], [ 0, 1 ] );
					};

				resolveVolume( volumeSettings1, volume1 );
				resolveVolume( volumeSettings2, volume2 );
				resolveVolume( volumeSettings3, volume3 );

				if ( oldSettings ) {
					var oldNoiseSettings = oldSettings.noise;

					if ( noiseSettings.type !== oldNoiseSettings.type ) {
						self._changeNoise( noiseNode, CONST.NOISE_TYPE[ noiseSettings.type ] );
					}

					if ( oldNoiseSettings.isEnabled && !noiseSettings.isEnabled ) {
						noiseNode.disconnect();
					} else if ( !oldNoiseSettings.isEnabled && noiseSettings.isEnabled ) {
						noiseNode.connect( noiseVolume );
					}

					noiseVolume.gain.value = settingsConvertor.transposeValue( noiseSettings.volume, [ 0, 100 ], [ 0, 1 ] );
				}

				self.settings.mixer = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "envelopesSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.envelopes ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.envelopes || {
						primary: {},
						filter: {}
					},
					resolve = function( oldSettings, settings, envelope ) {
						[
							"attack",
							"decay",
							"sustain",
							"release"
						].forEach( function( name ) {
							var newVal = settings[ name ];

							if ( oldSettings[ name ] !== newVal ) {
								envelope[ name ] = newVal;
							}
						} );
					};

				resolve( oldSettings.primary, settings.primary, self.gainEnvelope );
				resolve( oldSettings.filter, settings.filter, self.filterEnvelope );

				self.settings.envelopes = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "filterSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.filter ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.filter || {
						cutoff: null,
						emphasis: null
					},
					envelopeControlledFilter = self.envelopeControlledFilter,
					uiControlledFilter = self.uiControlledFilter,
					lfoControlledFilter = self.lfoControlledFilter,
					mix = self.envelopeFilterMix;

				if ( oldSettings.cutoff !== settings.cutoff ) {
					var cutoff = CONST.FILTER_FREQUENCY_UPPER_BOUND * settingsConvertor.transposeValue(
						settings.cutoff,
						[ 0, 500 ],
						[ 0, 1 ]
					);
					envelopeControlledFilter.node.frequency.value = cutoff;
					uiControlledFilter.node.frequency.value = cutoff;
				}
				if ( oldSettings.emphasis !== settings.emphasis ) {
					var emphasis = 40 * settingsConvertor.transposeValue( settings.emphasis, [ 1, 100 ], [ 0, 1 ] );
					envelopeControlledFilter.node.Q.value = emphasis;
					uiControlledFilter.node.Q.value = emphasis;
					lfoControlledFilter.node.Q.value = emphasis;
				}
				if ( oldSettings.envAmount !== settings.envAmount ) {
					mix.amount = settingsConvertor.transposeValue( settings.envAmount, [ 0, 100 ], [ 0, 1 ] );
				}

				self.settings.filter = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "lfoSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.lfo ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.lfo || {
						rate: null,
						waveform: null,
						amount: null
					},
					filterLfo = self.filterLfo,
					mix = self.lfoFilterMix;

				if ( oldSettings.rate !== settings.rate ) {
					filterLfo.rate = settings.rate;
				}
				if ( oldSettings.waveform !== settings.waveform ) {
					filterLfo.waveform = self._getWaveForm( settings.waveform );
				}
				if ( oldSettings.amount !== settings.amount ) {
					mix.amount = settingsConvertor.transposeValue( settings.amount, [ 0, 100 ], [ 0, 1 ] );
				}

				self.settings.lfo = JSON.parse( JSON.stringify( settings ) );
			}

		} );
	},

	_getWaveForm: function( index ) {
		var self = this,
			defaultForm = CONST.OSC_WAVEFORM[ index ],
			customFormFFT = null;

		if ( !defaultForm ) {
			customFormFFT = self.getCustomWaveForm(
				CONST.OSC_WAVEFORM_FFT[ index - CONST.OSC_WAVEFORM.length ]
			);
		}

		return {
			defaultForm: defaultForm,
			customFormFFT: customFormFFT
		};
	},

	_getCustomWaveForm: function( waveformFFT ) {
		var fft = waveformFFT.fft,
			size = fft.real.length,
			real = new Float32Array( size ),
			imag = new Float32Array( size );

		for ( var i = 0; i < size; i++ ) {
			real[ i ] = fft.real[ i ];
			imag[ i ] = fft.imag[ i ];
		}

		return {
			real: real,
			imag: imag
		};
	},

	_detuneOscillators: function( oscillators, activeNotes, oscillatorSettings, pitchSettings ) {
		var self = this,
			pitchDetune = settingsConvertor.transposeValue( pitchSettings.bend, [ -1, 1 ], [ -200, 200 ] ),
			osc1 = oscillators[ 0 ],
			osc2 = oscillators[ 1 ],
			osc3 = oscillators[ 2 ];

		osc1.detune.setValueAtTime( ( self._getDetune(
			oscillatorSettings.osc1.range,
			8
		) + pitchDetune ), 0 );
		osc2.detune.setValueAtTime( ( self._getDetune(
			oscillatorSettings.osc2.range,
			oscillatorSettings.osc2.fineDetune
		) + pitchDetune ), 0 );
		osc3.detune.setValueAtTime( ( self._getDetune(
			oscillatorSettings.osc3.range,
			oscillatorSettings.osc3.fineDetune,
			CONST.OSC3_RANGE_BASE
		) + pitchDetune ), 0 );
	},

	_getDetune: function( range, fineDetune, rangeBase ) {
		rangeBase = rangeBase === undefined ? CONST.RANGE_DEFAULT_BASE : rangeBase;
		var base = ( range - rangeBase ) * CONST.OCTAVE_CENTS;
		// if no fineDetune, then fineDetune === FINE_DETUNE_HALF_SPECTRE => fine === 0
		var fine = ( fineDetune - CONST.FINE_DETUNE_HALF_SPECTRE ) * CONST.SEMITONE_CENTS;

		return base + fine;
	},

	_setNoteToOscillator: function( noteFrequency, settings, oscillator ) {
		oscillator.frequency.cancelScheduledValues( 0 );
		oscillator.frequency.setTargetAtTime(
			noteFrequency,
			0,
			settingsConvertor.transposeValue(
				settings.modulation.portamento,
				[ 0, 100 ],
				[ 0, 1/6 ]
			)
		);
	},

	_changeNoise: function( noiseNode, type ) {
		var self = this;

		noiseNode.onaudioprocess = self._getNoiseGenerator( type, CONST.NOISE_BUFFER_SIZE );
	},

	_getNoiseGenerator: function( type, bufferSize ) {
		// code copied from here:
		//		http://noisehack.com/generate-noise-web-audio-api/
		var generator;

		switch ( type ) {
			case "white":
				generator = function( e ) {
					var output = e.outputBuffer.getChannelData( 0 );
					for ( var i = 0; i < bufferSize; i++ ) {
						output[ i ] = Math.random() * 2 - 1;
					}
				};
				break;
			case "pink":
				generator = ( function() {
					var b0, b1, b2, b3, b4, b5, b6;
					b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
					var result = function( e ) {
						var output = e.outputBuffer.getChannelData( 0 );
						for ( var i = 0; i < bufferSize; i++ ) {
							var white = Math.random() * 2 - 1;

							b0 = 0.99886 * b0 + white * 0.0555179;
							b1 = 0.99332 * b1 + white * 0.0750759;
							b2 = 0.96900 * b2 + white * 0.1538520;
							b3 = 0.86650 * b3 + white * 0.3104856;
							b4 = 0.55000 * b4 + white * 0.5329522;
							b5 = -0.7616 * b5 - white * 0.0168980;

							output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
							output[i] *= 0.11; // (roughly) compensate for gain

							b6 = white * 0.115926;
						}
					};
					return result;
				} )();
				break;
			case "brown":
				generator = ( function() {
					var lastOut = 0.0;
					var result = function( e ) {
						var output = e.outputBuffer.getChannelData( 0 );
						for ( var i = 0; i < bufferSize; i++ ) {
							var white = Math.random() * 2 - 1;
							output[ i ] = ( lastOut + ( 0.02 * white ) ) / 1.02;
							lastOut = output[ i ];
							output[ i ] *= 3.5; // (roughly) compensate for gain
						}
					};
					return result;
				} )();
				break;
		}

		return generator;
	}

};

module.exports = Instrument;
/* jshint -W098 */

'use strict';

var CONST = require( "./engine/const" ),
	utils = require( "./engine/utils" ),
	Envelope = require( "./engine/envelope" ),
	Filter = require( "./engine/filter" );

function Instrument( audioContext ) {
	var self = this,
		volumes = [],
		oscillators = [],
		noiseVolume = audioContext.createGain(),
		noiseNode = audioContext.createScriptProcessor( CONST.NOISE_BUFFER_SIZE, 1, 1 ),
		envelope = new Envelope( audioContext ),
		filter = new Filter( audioContext ),
		masterVolume = audioContext.createGain();

	masterVolume.gain.value = 1.0;

	while ( oscillators.length < 3 ) {
		var osc = audioContext.createOscillator(),
			volume = audioContext.createGain();

		volume.gain.value = 0.0;
		volume.connect( envelope.node );

		osc.frequency.setValueAtTime( 110, 0 );
		osc.connect( volume );
		osc.start( 0 );

		volumes.push( volume );
		oscillators.push( osc );
	}

	noiseVolume.gain.value = 0.0;

	noiseVolume.connect( envelope.node );

	envelope.node.connect( filter.node );
	filter.node.connect( masterVolume );

	self.audioContext = audioContext;
	self.volumes = volumes;
	self.oscillators = oscillators;
	self.noiseVolume = noiseVolume;
	self.noiseNode = noiseNode;
	self.envelope = envelope;
	self.filter = filter;
	self.outputNode = masterVolume;
	self.activeNotes = [];
	self.settings = {

		modulation: null,
		oscillators: null,
		mixer: null,
		envelopes: null,
		filter: null

	};

	self._defineProps();

	self.modulationSettings = CONST.DEFAULT_MOD_SETTINGS;
	self.oscillatorSettings = CONST.DEFAULT_OSC_SETTINGS;
	self.mixerSettings = CONST.DEFAULT_MIX_SETTINGS;
	self.envelopesSettings = CONST.DEFAULT_ENVELOPES_SETTINGS;
	self.filterSettings = CONST.DEFAULT_FILTER_SETTINGS;

	self._changeNoise( noiseNode, CONST.NOISE_TYPE[ CONST.DEFAULT_NOISE_TYPE ] );
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
			envelope = self.envelope,
			activeNotes = self.activeNotes,
			settings = self.settings;

		activeNotes.push( noteFrequency );

		self.oscillators.forEach( function( osc ) {
			self._setNoteToOscillator( noteFrequency, settings, osc );
		} );

		envelope.start();
	},

	onNoteOff: function( noteFrequency, velocity ) {
		var self = this,
			envelope = self.envelope,
			activeNotes = self.activeNotes,
			settings = self.settings,
			position = activeNotes.indexOf( noteFrequency );

		if ( position !== -1 ) {
			activeNotes.splice( position, 1 );
		}

		if ( activeNotes.length === 0 ) {
			envelope.end();
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

					resolveFineDetune( oldOscSettings3, oscSettings3, osc3, CONST.OSC3_RANGE_BASE );
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
						self._changeNoise( noiseNode, CONST.NOISE_TYPE[ noiseSettings.type ] );
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
								var methodName = "get" + name[ 0 ].toUpperCase() + name.slice( 1 );
								envelope[ name ] = utils[ methodName ]( newVal );
								console.log( name + ": " + utils[ methodName ]( newVal ) );
							}
						} );
					};

				resolve( oldSettings.primary, settings.primary, self.envelope );
				// resolve( oldSettings.filter, settings.filter, self.filter );

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
					filter = self.filter;

				if ( oldSettings.cutoff !== settings.cutoff ) {
					filter.cutoff = utils.getCutoff( settings.cutoff );
				}
				if ( oldSettings.emphasis !== settings.emphasis ) {
					filter.emphasis = utils.getEmphasis( settings.emphasis );
				}

				self.settings.filter = JSON.parse( JSON.stringify( settings ) );
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
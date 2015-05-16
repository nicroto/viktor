/* jshint -W098 */

'use strict';

var settingsConvertor = require( "settings-convertor" ),
	CONST = require( "./engine/const" ),
	OscillatorBank = require( "./engine/oscillator-bank" ),
	WaveformSource = require( "./engine/waveform-source" ),
	Noise = require( "./engine/noise" ),
	Envelope = require( "./engine/envelope" ),
	Filter = require( "./engine/filter" ),
	LFO = require( "./engine/lfo" ),
	Mix = require( "./engine/mix" );

function Instrument( audioContext ) {
	var self = this,
		oscillatorBank = new OscillatorBank( audioContext, 3 ),
		waveformSource = new WaveformSource( audioContext, CONST.CUSTOM_WAVEFORMS ),
		noise = new Noise( audioContext ),
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

	oscillatorBank.output.connect( gainEnvelope.node );
	noise.output.connect( gainEnvelope.node );

	filterEnvelope.node = envelopeControlledFilter.node;

	masterVolume.gain.value = 1.0;

	var modulationLfo = new LFO( audioContext, oscillatorBank.oscillators, "frequency", {
		rate: 0,
		defaultForm: CONST.LFO_DEFAULT_FORM,
		frequencyRange: CONST.MODULATION_LFO_FREQUENCY_RANGE
	} );

	gainEnvelope.node.connect( envelopeControlledFilter.node );
	gainEnvelope.node.connect( uiControlledFilter.node );
	envelopeFilterMix.output.connect( lfoControlledFilter.node );
	lfoFilterMix.output.connect( masterVolume );

	self.audioContext = audioContext;
	self.modulationLfo = modulationLfo;
	self.oscillatorBank = oscillatorBank;
	self.waveformSource = waveformSource;
	self.noise = noise;
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
		noise: null,
		envelopes: null,
		filter: null,
		lfo: null,
		pitch: null

	};

	self._defineProps();

	self.modulationSettings = CONST.DEFAULT_MOD_SETTINGS;
	self.oscillatorSettings = CONST.DEFAULT_OSC_SETTINGS;
	self.mixerSettings = CONST.DEFAULT_MIX_SETTINGS;
	self.noiseSettings = CONST.DEFAULT_NOISE_SETTINGS;
	self.envelopesSettings = CONST.DEFAULT_ENVELOPES_SETTINGS;
	self.filterSettings = CONST.DEFAULT_FILTER_SETTINGS;
	self.lfoSettings = CONST.DEFAULT_LFO_SETTINGS;
	self.pitchSettings = CONST.DEFAULT_PITCH_SETTINGS;
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
			oscillatorBank = self.oscillatorBank,
			gainEnvelope = self.gainEnvelope,
			filterEnvelope = self.filterEnvelope,
			activeNotes = self.activeNotes,
			portamento = self.settings.modulation.portamento.value,
			hasANoteDown = activeNotes.length > 0;

		if ( !hasANoteDown ) {
			self._pitchDetuneOscillatorBank( oscillatorBank, self.pitchSettings.bend.value );
		}

		activeNotes.push( noteFrequency );

		oscillatorBank.note = {
			frequency: noteFrequency,
			portamento: portamento
		};

		gainEnvelope.start();
		filterEnvelope.start();
	},

	onNoteOff: function( noteFrequency, velocity ) {
		var self = this,
			oscillatorBank = self.oscillatorBank,
			gainEnvelope = self.gainEnvelope,
			filterEnvelope = self.filterEnvelope,
			activeNotes = self.activeNotes,
			portamento = self.settings.modulation.portamento.value,
			position = activeNotes.indexOf( noteFrequency );

		if ( position !== -1 ) {
			activeNotes.splice( position, 1 );
		}

		if ( activeNotes.length === 0 ) {
			gainEnvelope.end();
			filterEnvelope.end();
		} else {
			noteFrequency = activeNotes[ activeNotes.length - 1 ];

			oscillatorBank.note = {
				frequency: noteFrequency,
				portamento: portamento
			};
		}
	},

	onPitchBend: function( pitchBend ) {
		var self = this;

		self.pitchSettings = {
			bend: settingsConvertor.transposeParam( pitchBend, self.settings.pitch.bend.range )
		};
	},

	onModulationWheelTurn: function( modulation ) {
		var self = this,
			oldSettings = self.modulationSettings,
			newRate = settingsConvertor.transposeParam( modulation, [ 0, 15 ] );

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
					oscillatorBank = self.oscillatorBank,
					oldSettings = self.settings.pitch || { bend: {} },
					hasANoteDown = self.activeNotes.length > 0;

				if ( hasANoteDown && oldSettings.bend.value !== settings.bend.value ) {
					self._pitchDetuneOscillatorBank( oscillatorBank, settings.bend.value );
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
				var waveformSource = self.waveformSource,
					oldSettings = self.settings.modulation,
					modulationLfo = self.modulationLfo;

				if ( !oldSettings || ( oldSettings.rate.value !== settings.rate.value ) ) {
					modulationLfo.rate = settings.rate.value;
				}

				if ( !oldSettings || ( oldSettings.waveform.value !== settings.waveform.value ) ) {
					var index = settings.waveform.value;

					modulationLfo.waveform = {
						defaultForm: waveformSource.defaultForms[ index ],
						customFormFFT: waveformSource.customForms[ CONST.OSC_WAVEFORM[ index ] ]
					};
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
					oscillatorBank = self.oscillatorBank,
					waveformSource = self.waveformSource;

				oscillatorBank.forEach( function( osc, index ) {
					var propName = "osc" + ( index + 1 ),
						oldOscSettings = oldSettings && oldSettings[ propName ],
						newOscSettings = settings[ propName ];

					if ( !oldSettings || oldOscSettings.range.value !== newOscSettings.range.value ) {
						osc.octave = newOscSettings.range.value;
					}
					if ( !oldSettings || oldOscSettings.fineDetune.value !== newOscSettings.fineDetune.value ) {
						osc.semitone = newOscSettings.fineDetune.value;
					}
					if ( !oldSettings || oldOscSettings.waveform.value !== newOscSettings.waveform.value ) {
						var waveform = newOscSettings.waveform.value,
							defaultForm = waveformSource.defaultForms[ waveform ];

						if ( defaultForm ) {
							osc.waveform = defaultForm;
						} else {
							osc.customWaveform = waveformSource.customForms[ CONST.OSC_WAVEFORM[ waveform ] ];
						}
					}

				} );

				self.settings.oscillators = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "mixerSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.mixer ) );
			},

			set: function( settings ) {
				var oscillatorBank = self.oscillatorBank,
					oldSettings = self.settings.mixer;

				oscillatorBank.forEach( function( osc, index ) {
					var volumePropName = "volume" + ( index + 1 ),
						oldOscSettings = oldSettings && oldSettings[ volumePropName ],
						newOscSettings = settings[ volumePropName ];

					if ( !oldSettings || oldOscSettings.enabled.value !== newOscSettings.enabled.value ) {
						osc.enabled = newOscSettings.enabled.value ? true : false;
					}
					if ( !oldSettings || oldOscSettings.level.value !== newOscSettings.level.value ) {
						osc.level = newOscSettings.level.value;
					}
				} );

				self.settings.mixer = JSON.parse( JSON.stringify( settings ) );
			}

		} );

		Object.defineProperty( self, "noiseSettings", {

			get: function() {
				// if slow - use npm clone
				return JSON.parse( JSON.stringify( self.settings.noise ) );
			},

			set: function( settings ) {
				var oldSettings = self.settings.noise || {},
					noise = self.noise;

				if ( oldSettings.enabled !== settings.enabled ) {
					noise.enabled = settings.enabled;
				}
				if ( oldSettings.level !== settings.level ) {
					noise.level = settingsConvertor.transposeValue( settings.level, [ 0, 100 ], [ 0, 1 ] );
				}
				if ( oldSettings.type !== settings.type ) {
					noise.type = settings.type;
				}

				self.settings.noise = JSON.parse( JSON.stringify( settings ) );
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
								newVal = ( ( name === "sustain" ) ?
									settingsConvertor.transposeValue( newVal, [ 0, 100 ], [ 0.001, 1 ] )
									:
									settingsConvertor.transposeValue( newVal, [ 0, 100 ], [ 0, 2 ] )
								);

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
				var waveformSource = self.waveformSource,
					oldSettings = self.settings.lfo || {
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
					var index = settings.waveform;

					filterLfo.waveform = {
						defaultForm: waveformSource.defaultForms[ index ],
						customFormFFT: waveformSource.customForms[ CONST.OSC_WAVEFORM[ index ] ]
					};
				}
				if ( oldSettings.amount !== settings.amount ) {
					mix.amount = settingsConvertor.transposeValue( settings.amount, [ 0, 100 ], [ 0, 1 ] );
				}

				self.settings.lfo = JSON.parse( JSON.stringify( settings ) );
			}

		} );
	},

	_pitchDetuneOscillatorBank: function( oscillatorBank, value ) {
		oscillatorBank.forEach( function( oscillatorSettings ) {
			oscillatorSettings.cent = value;
		} );
	}

};

module.exports = Instrument;
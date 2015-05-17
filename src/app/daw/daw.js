'use strict';

var CONST = require( "./engine/const" ),
	MIDIController = require( "./engine/midi" ),
	Tuna = require( "tuna" );

function DAW( AudioContext, instrumentTypes, selectedPatch ) {
	var self = this,
		audioContext = new AudioContext(),
		tuna = new Tuna( audioContext ),
		delay = new tuna.Delay( CONST.TUNA_DELAY_DEFAULT_SETTINGS ),
		reverb = new tuna.Convolver( CONST.TUNA_REVERB_DEFAULT_SETTINGS ),
		masterVolume = audioContext.createGain();

	masterVolume.gain.value = 1;

	delay.connect( reverb.input );
	reverb.connect( masterVolume );
	masterVolume.connect( audioContext.destination );

	self.audioContext = audioContext;
	self.selectedPatch = selectedPatch;
	self.instrumentTypes = instrumentTypes;
	self.midiController = new MIDIController();
	self.delay = delay;
	self.reverb = reverb;
	self.masterVolume = masterVolume;
	self.instruments = [];
	self.selectedInstrument = null;
	self.externalMidiMessageHandlers = [];
	self.settings = {
		pitch: null,
		modulation: null,
		delay: null,
		reverb: null,
		masterVolume: null
	};

	self._defineProps();

	// pitch & modulation settings are set in init

	self.delaySettings = CONST.DEFAULT_DELAY_SETTINGS;
	self.reverbSettings = CONST.DEFAULT_REVERB_SETTINGS;
	self.masterVolumeSettings = CONST.DEFAULT_MASTER_VOLUME_SETTINGS;
}

DAW.prototype = {

	init: function( callback ) {
		var self = this,
			audioContext = self.audioContext,
			midiController = self.midiController,
			instruments = self.instruments;

		midiController.init( function() {
			midiController.setMessageHandler(
				self.propagateMidiMessage.bind( self )
			);

			self.instrumentTypes.forEach( function( Instrument ) {
				instruments.push( self.createInstrument( Instrument ) );
			} );

			self.selectInstrument( 0 );

			self.pitchSettings = CONST.DEFAULT_PITCH_SETTINGS;
			self.modulationSettings = CONST.DEFAULT_MODULATION_SETTINGS;

			self.loadPatch( self.selectedPatch );

			if ( callback ) {
				callback();
			}
		} );

		self.audioContext = audioContext;
	},

	loadPatch: function( patch ) {
		var self = this,
			instruments = self.instruments;

		if ( patch ) {
			// first apply instrument patches (pitch, modulation etc. should override)
			instruments.forEach( function( instrument ) {
				var instrumentPatch = patch.instruments[ instrument.name ];
				if ( instrumentPatch ) {
					instrument.loadPatch( instrumentPatch );
				}
			} );

			Object.keys( patch.daw ).forEach( function( key ) {
				self[ key + "Settings" ] = patch.daw[ key ];
			} );
		}
	},

	getPatch: function() {
		var self = this,
			instrumentPatches = {};

		self.instruments.forEach( function( instrument ) {
			instrumentPatches[ instrument.name ] = instrument.getPatch();
		} );

		return JSON.parse( JSON.stringify( {
			daw: self.settings,
			instruments: instrumentPatches
		} ) );
	},

	selectInstrument: function( index ) {
		var self = this;

		self.selectedInstrument = self.instruments[ index ];
	},

	createInstrument: function( Instrument ) {
		var self = this,
			audioContext = self.audioContext,
			newInstrument = new Instrument( audioContext );

		newInstrument.outputNode.connect( self.delay.input );

		return newInstrument;
	},

	propagateMidiMessage: function( eventType, parsed, rawEvent ) {
		var self = this,
			selectedInstrument = self.selectedInstrument,
			externalHandlers = self.externalMidiMessageHandlers;

		selectedInstrument.onMidiMessage( eventType, parsed, rawEvent );

		externalHandlers.forEach( function( handler ) {
			handler( eventType, parsed, rawEvent );
		} );
	},

	externalMidiMessage: function( midiEvent ) {
		var self = this,
			midiController = self.midiController;

		midiController.onMidiMessage( midiEvent );
	},

	addExternalMidiMessageHandler: function( handler ) {
		var self = this,
			handlers = self.externalMidiMessageHandlers;

		handlers.push( handler );
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
					oldSettings = self.settings.pitch || { bend: {} };

				if ( oldSettings.bend.value !== settings.bend.value ) {
					self.instruments.forEach( function( instrument ) {
						instrument.pitchSettings = settings;
					} );
				}

				self.settings.pitch = JSON.parse( JSON.stringify( settings ) );
			}
		} );

		Object.defineProperty( self, "modulationSettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.modulation ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.modulation || {};

				if ( oldSettings.rate !== settings.rate ) {
					self.instruments.forEach( function( instrument ) {
						var alteredSettings = instrument.modulationSettings;

						alteredSettings.rate = settings.rate;

						instrument.modulationSettings = alteredSettings;
					} );
				}

				self.settings.modulation = JSON.parse( JSON.stringify( settings ) );
			}
		} );

		Object.defineProperty( self, "delaySettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.delay ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.delay || { time: {}, feedback: {}, dry: {}, wet: {} },
					delay = self.delay;

				if ( oldSettings.time.value !== settings.time.value ) {
					delay.delayTime = settings.time.value;
				}
				if ( oldSettings.feedback.value !== settings.feedback.value ) {
					delay.feedback = settings.feedback.value;
				}
				if ( oldSettings.dry.value !== settings.dry.value ) {
					delay.dryLevel = settings.dry.value;
				}
				if ( oldSettings.wet.value !== settings.wet.value ) {
					delay.wetLevel = settings.wet.value;
				}

				self.settings.delay = JSON.parse( JSON.stringify( settings ) );
			}
		} );

		Object.defineProperty( self, "reverbSettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.reverb ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.reverb || { level: {} },
					reverb = self.reverb;

				if ( oldSettings.level.value !== settings.level.value ) {
					var newGain = settings.level.value;

					reverb.wetLevel = newGain;
					reverb.dryLevel = 1 - ( newGain / 2 );
				}

				self.settings.reverb = JSON.parse( JSON.stringify( settings ) );
			}
		} );

		Object.defineProperty( self, "masterVolumeSettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.masterVolume ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.masterVolume || { level: {} },
					masterVolume = self.masterVolume;

				if ( oldSettings.level.value !== settings.level.value ) {
					masterVolume.gain.value = settings.level.value;
				}

				self.settings.masterVolume = JSON.parse( JSON.stringify( settings ) );
			}
		} );

	}

};

module.exports = DAW;
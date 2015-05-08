'use strict';

var CONST = require( "./engine/const" ),
	utils = require( "./engine/utils" ),
	MIDIController = require( "./engine/midi" ),
	Tuna = require( "tuna" );

function DAW( AudioContext ) {
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
	self.midiController = new MIDIController();
	self.delay = delay;
	self.reverb = reverb;
	self.masterVolume = masterVolume;
	self.synth = null;
	self.externalMidiMessageHandlers = [];
	self.settings = {
		pitch: null,
		delay: null,
		reverb: null,
		masterVolume: null
	};

	self._defineProps();

	self.delaySettings = CONST.DEFAULT_DELAY_SETTINGS;
	self.reverbSettings = CONST.DEFAULT_REVERB_SETTINGS;
	self.masterVolumeSettings = CONST.DEFAULT_MASTER_VOLUME_SETTINGS;
}

DAW.prototype = {

	init: function( callback ) {
		var self = this,
			audioContext = self.audioContext,
			midiController = self.midiController;

		midiController.init( function() {
			midiController.setMessageHandler(
				self.propagateMidiMessage.bind( self )
			);

			self.synth = self.createInstrument(
				require( "./instruments/synth/instrument" )
			);

			self.pitchSettings = CONST.DEFAULT_PITCH_SETTINGS;

			if ( callback ) {
				callback();
			}
		} );

		self.audioContext = audioContext;
	},

	createInstrument: function( Instrument, settings ) {
		var self = this,
			audioContext = self.audioContext,
			newInstrument = new Instrument( audioContext, settings );

		newInstrument.outputNode.connect( self.delay.input );

		return newInstrument;
	},

	propagateMidiMessage: function( eventType, parsed, rawEvent ) {
		var self = this,
			synth = self.synth,
			externalHandlers = self.externalMidiMessageHandlers;

		synth.onMidiMessage( eventType, parsed, rawEvent );

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
					oldSettings = self.settings.pitch || {};

				if ( oldSettings.bend !== settings.bend ) {
					self.synth.pitchSettings = settings;
				}

				self.settings.pitch = JSON.parse( JSON.stringify( settings ) );
			}
		} );

		Object.defineProperty( self, "delaySettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.delay ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.delay || {},
					delay = self.delay;

				if ( oldSettings.time !== settings.time ) {
					delay.delayTime = utils.getTime( settings.time );
				}
				if ( oldSettings.feedback !== settings.feedback ) {
					delay.feedback = utils.getFeedback( settings.feedback );
				}
				if ( oldSettings.dry !== settings.dry ) {
					delay.dryLevel = utils.getDryLevel( settings.dry );
				}
				if ( oldSettings.wet !== settings.wet ) {
					delay.wetLevel = utils.getWetLevel( settings.wet );
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
					oldSettings = self.settings.reverb || {},
					reverb = self.reverb;

				if ( oldSettings.level !== settings.level ) {
					var newGain = utils.getGain( settings.level );

					reverb.wetLevel = newGain;
					reverb.dryLevel = utils.getReverbDryLevel( newGain );
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
					oldSettings = self.settings.masterVolume || {},
					masterVolume = self.masterVolume;

				if ( oldSettings.level !== settings.level ) {
					masterVolume.gain.value = utils.getGain( settings.level );
				}

				self.settings.masterVolume = JSON.parse( JSON.stringify( settings ) );
			}
		} );

	}

};

module.exports = DAW;
'use strict';

var CONST = require( "./engine/const" ),
	utils = require( "./engine/utils" ),
	MIDIController = require( "./engine/midi" ),
	Tuna = require( "tuna" );

function DAW( AudioContext ) {
	var self = this,
		audioContext = new AudioContext(),
		tuna = new Tuna( audioContext ),
		reverb = new tuna.Convolver( CONST.TUNA_REVERB_DEFAULT_SETTINGS );

	reverb.connect( audioContext.destination );

	self.audioContext = audioContext;
	self.midiController = new MIDIController();
	self.reverb = reverb;
	self.synth = null;
	self.externalMidiMessageHandlers = [];
	self.settings = {
		pitch: null,
		reverb: null
	};

	self._defineProps();

	self.reverbSettings = CONST.DEFAULT_REVERB_SETTINGS;
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

		newInstrument.outputNode.connect( self.reverb.input );

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

		Object.defineProperty( self, "reverbSettings", {
			get: function() {
				var self = this;

				return JSON.parse( JSON.stringify( self.settings.reverb ) );
			},
			set: function( settings ) {
				var self = this,
					oldSettings = self.settings.reverb || {};

				if ( oldSettings.level !== settings.level ) {
					var newGain = utils.getGain( settings.level );

					self.reverb.wetLevel = newGain;
					self.reverb.dry = 1 - newGain;
				}

				self.settings.reverb = JSON.parse( JSON.stringify( settings ) );
			}
		} );

	}

};

module.exports = DAW;
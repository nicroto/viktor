'use strict';

var CONST = require( "./engine/const" ),
	MIDIController = require( "./engine/midi" );

function DAW( AudioContext ) {
	var self = this;

	self.audioContext = new AudioContext();
	self.midiController = new MIDIController();
	self.synth = null;
	self.externalMidiMessageHandlers = [];
	self.settings = {
		pitch: null
	};

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

			self.settings.pitch = JSON.parse( JSON.stringify( settings ) );;
		}
	} );
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

		newInstrument.outputNode.connect( audioContext.destination );

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
	}

};

module.exports = DAW;
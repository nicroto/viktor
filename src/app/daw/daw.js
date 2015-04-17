'use strict';

var MIDIController = require( "./controllers/midi" );

function DAW( AudioContext ) {
	var self = this;

	self.audioContext = new AudioContext();
	self.midiController = new MIDIController();
	self.synth = null;
	self.externalMidiMessageHandlers = [];
}

DAW.prototype = {

	init: function( callback ) {
		var self = this,
			audioContext = self.audioContext,
			midiController = self.midiController;

		midiController.init( function( error ) {
			midiController.setMessageHandler(
				self.propagateMidiMessage.bind( self )
			);

			self.synth = self.createInstrument(
				require( "./instruments/synth/instrument" )
			);

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
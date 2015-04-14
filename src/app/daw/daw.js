'use strict';

var MIDIController = require( "./controllers/midi" );

function DAW( AudioContext ) {
	var self = this;

	self.audioContext = new AudioContext();
	self.midiController = new MIDIController();
	self.instruments = [];
	self.externalMidiMessageHandlers = [];
}

DAW.prototype = {

	init: function( callback ) {
		var self = this,
			audioContext = self.audioContext,
			midiController = self.midiController;

		midiController.init( function( error ) {
			if ( error ) {
				console.log( error );
			} else {
				midiController.setMessageHandler(
					self.propagateMidiMessage.bind( self )
				);
			}

			self.addInstrument( require( "./instruments/synth/instrument" ) );

			if ( callback ) {
				callback();
			}
		} );

		self.audioContext = audioContext;
	},

	addInstrument: function( Instrument, settings ) {
		var self = this,
			instruments = self.instruments,
			audioContext = self.audioContext,
			newInstrument = new Instrument( audioContext, settings );

		instruments.push( newInstrument );

		newInstrument.outputNode.connect( audioContext.destination );
	},

	propagateMidiMessage: function( eventType, parsed, rawEvent ) {
		var self = this,
			instruments = self.instruments,
			externalHandlers = self.externalMidiMessageHandlers;

		instruments.forEach( function( inst ) {
			inst.onMidiMessage( eventType, parsed, rawEvent );
		} );

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
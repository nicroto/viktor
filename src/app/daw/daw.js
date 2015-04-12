'use strict';

var MIDIController = require( "./controllers/midi" );

function DAW( AudioContext ) {
	var self = this;

	self.audioContext = new AudioContext();
	self.instruments = [];
}

DAW.prototype = {

	init: function( callback ) {
		var self = this,
			audioContext = self.audioContext,
			midiController = new MIDIController();

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
			instruments = self.instruments;

		instruments.forEach( function( inst ) {
			inst.onMidiMessage( eventType, parsed, rawEvent );
		} );
	}

};

module.exports = DAW;
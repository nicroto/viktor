'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "KeyboardCtrl", [ "dawEngine", function( dawEngine ) {

		var $keyboard = $( "webaudio-keyboard" );

		dawEngine.addExternalMidiMessageHandler( function( type, parsed, rawEvent ) {
			$keyboard[ 0 ].setNote( parsed.isNoteOn ? 1 : 0, rawEvent.data[ 1 ] );
		} );

		$keyboard.on( "change", function( e ) {
			var eventObject = e.originalEvent,
				firstMidiByte = ( eventObject.note[ 0 ] === 1 ) ? 144 : 128,
				secondMidiByte = eventObject.note[ 1 ],
				thirdMidiByte = 100,
				midiEvent = {
					data: [ firstMidiByte, secondMidiByte, thirdMidiByte ]
				};

			dawEngine.externalMidiMessage( midiEvent );
		} );

	} ] );

};
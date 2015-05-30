'use strict';

module.exports = function( mod ) {

	mod.controller( "KeyboardCtrl", function() {} );

	mod.directive( "keyboard", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "keyboard.html" )
		};
	} ] );

	mod.directive( "keyboardValue", [ "dawEngine", function( dawEngine ) {

		return {
			restrict: "A",
			link: function( scope, $element ) {

				dawEngine.addExternalMidiMessageHandler( function( type, parsed, rawEvent ) {
					if ( type === "notePress" ) {
						$element[ 0 ].setNote( parsed.isNoteOn ? 1 : 0, rawEvent.data[ 1 ] );
					}
				} );

				$element.on( "change", function( e ) {
					var eventObject = e,
						firstMidiByte = ( eventObject.note[ 0 ] === 1 ) ? 144 : 128,
						secondMidiByte = eventObject.note[ 1 ],
						thirdMidiByte = 100,
						midiEvent = {
							data: [ firstMidiByte, secondMidiByte, thirdMidiByte ]
						};

					dawEngine.externalMidiMessage( midiEvent );
				} );

			}
		};

	} ] );

};
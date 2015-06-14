'use strict';

var KEYCODE_SYMBOL_MAP = {
		90: "Z",
		83: "S",
		88: "X",
		68: "D",
		67: "C",
		86: "V",
		71: "G",
		66: "B",
		72: "H",
		78: "N",
		74: "J",
		77: "M",
		188: ",",
		76: "L",
		190: ".",
		186: ";",
		191: "/",
		81: "Q",
		50: "2",
		87: "W",
		51: "3",
		69: "E",
		82: "R",
		53: "5",
		84: "T",
		54: "6",
		89: "Y",
		55: "7",
		85: "U",
		73: "I",
		57: "9",
		79: "O",
		48: "0",
		80: "P",
		219: "[",
		174: "+",
		221: "]"
	},
	SYMBOL_NOTENUM_MAP = {
		"Z": 60,
			"S": 61,
		"X": 62,
			"D": 63,
		"C": 64,
		"V": 65,
			"G": 66,
		"B": 67,
			"H": 68,
		"N": 69,
			"J": 70,
		"M": 71,
		",": 72,
			"L": 73,
		".": 74,
			";": 75,
		"/": 76,

		"Q": 84,
			"2": 85,
		"W": 86,
			"3": 87,
		"E": 88,
		"R": 89,
			"5": 90,
		"T": 91,
			"6": 92,
		"Y": 93,
			"7": 94,
		"U": 95,
		"I": 96,
			"9": 97,
		"O": 98,
			"0": 99,
		"P": 100,
		"[": 101,
			"+": 102,
		"]": 103
	};

var produceMidiMessage = function( firstByte, secondByte, thirdByte ) {
	return { data: [ firstByte, secondByte, thirdByte ] };
};

var keyboardToDawHandler = function( dawEngine, isNoteOn, eventObject ) {
	var symbol = KEYCODE_SYMBOL_MAP[ eventObject.keyCode ];

	if ( symbol !== undefined ) {
		var noteNumber = SYMBOL_NOTENUM_MAP[ symbol ];

		if ( noteNumber !== undefined ) {
			var midiMessage = produceMidiMessage(
				isNoteOn ? 144 : 128,
				noteNumber,
				100
			);

			dawEngine.externalMidiMessage( midiMessage );
		}
	}
};

module.exports = function( mod ) {

	mod.controller( "KeyboardCtrl", function() {} );

	mod.directive( "keyboard", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "keyboard.html" )
		};
	} ] );

	mod.directive( "keyboardValue", [ "$document", "dawEngine", function( $document, dawEngine ) {

		return {
			restrict: "A",
			link: function( scope, $element ) {

				dawEngine.addExternalMidiMessageHandler( function( type, parsed, rawEvent ) {
					if ( type === "notePress" ) {
						$element[ 0 ].setNote( parsed.isNoteOn ? 1 : 0, rawEvent.data[ 1 ] );
					}
				} );

				$element.on( "change", function( eventObject ) {
					var midiMessage = produceMidiMessage(
							( eventObject.note[ 0 ] === 1 ) ? 144 : 128,
							eventObject.note[ 1 ],
							100
						);

					dawEngine.externalMidiMessage( midiMessage );
				} );

				$document.on( "keydown", keyboardToDawHandler.bind( null, dawEngine, true ) );
				$document.on( "keyup", keyboardToDawHandler.bind( null, dawEngine, false ) );

			}
		};

	} ] );

};
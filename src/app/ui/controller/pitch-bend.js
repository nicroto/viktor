'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" ),
	BEND_RANGE = [ 0, 128 ],
	RANGE_CENTER = settingsConvertor.getRangeCenter( BEND_RANGE );

module.exports = function( mod ) {

	mod.controller( "PitchBendCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.pitchSettings = {
					bend: settingsConvertor.transposeParam( self.bend, settings.bend.range )
				};
			},
			settings = dawEngine.pitchSettings;

		self.bend = settingsConvertor.transposeParam( settings.bend, BEND_RANGE );

		[
			"pitch.bend.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

	} ] );

	mod.directive( "pitchBend", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "pitch-bend.html" )
		};
	} ] );

	mod.directive( "pitchBendValue", [ "$document", "dawEngine", function( $document, dawEngine ) {

		return {
			restrict: "A",
			link: function( scope, $element ) {
				dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
					if ( type === "pitchBend" ) {
						$element[ 0 ].setValue(
							settingsConvertor.transposeParam( parsed.pitchBend, BEND_RANGE ).value
						);
					}
				} );

				// handle pitch return to center
				var isPitchBending = false;
				$document.on( "mouseup", function() {
					if ( isPitchBending ) {
						isPitchBending = false;
						$element.attr( "value", RANGE_CENTER );
					}
				} );
				$element.on( "mousedown", function() {
					isPitchBending = true;
				} );
			}
		};

	} ] );

};
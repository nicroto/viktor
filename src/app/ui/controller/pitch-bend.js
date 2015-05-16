'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "PitchBendCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.pitchSettings = {
					bend: settingsConvertor.transposeParam( self.bend, settings.bend.range )
				};
			},
			settings = dawEngine.pitchSettings,
			$pitchBend = $( ".pitch-bend webaudio-slider" );

		self.bend = settingsConvertor.transposeParam( settings.bend, [ 0, 128 ] );

		[
			"pitch.bend.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
			if ( type === "pitchBend" ) {
				$pitchBend[ 0 ].setValue(
					settingsConvertor.transposeParam( parsed.pitchBend, self.bend.range ).value
				);
			}
		} );

		// fix issue with initial value settings
		$timeout( function() {
			$pitchBend[ 0 ].setValue( self.bend.value );
		}, 500 );

		// fix the lack of attr 'value' update
		$pitchBend.on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

		// handle pitch return to center
		var isPitchBending = false;
		$( "body" ).on( "mouseup", function() {
			if ( isPitchBending ) {
				isPitchBending = false;
				self.bend.value = settingsConvertor.getRangeCenter( self.bend.range );
				$pitchBend[ 0 ].setValue( self.bend.value );
				settingsChangeHandler();
			}
		} );
		$pitchBend.on( "mousedown", function() {
			isPitchBending = true;
		} );

	} ] );

	mod.directive( "pitchBend", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "pitch-bend.html" )
		};
	} ] );

};
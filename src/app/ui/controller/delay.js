'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "DelayCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.delaySettings = {
					time	: settingsConvertor.transposeParam( self.time, settings.time.range ),
					feedback: settingsConvertor.transposeParam( self.feedback, settings.feedback.range ),
					dry		: settingsConvertor.transposeParam( self.dry, settings.dry.range ),
					wet		: settingsConvertor.transposeParam( self.wet, settings.wet.range )
				};
			},
			settings = dawEngine.delaySettings;

		self.time = settingsConvertor.transposeParam( settings.time, [ 0, 100 ] );
		self.feedback = settingsConvertor.transposeParam( settings.feedback, [ 0, 100 ] );
		self.dry = settingsConvertor.transposeParam( settings.dry, [ 0, 100 ] );
		self.wet = settingsConvertor.transposeParam( settings.wet, [ 0, 100 ] );

		[
			"delay.time.value",
			"delay.feedback.value",
			"delay.dry.value",
			"delay.wet.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix the lack of attr 'value' update
		$( ".delay webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "delay", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "delay.html" )
		};
	} ] );

};
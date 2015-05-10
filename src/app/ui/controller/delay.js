'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "DelayCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.delaySettings = {
					time: self.time,
					feedback: self.feedback,
					dry: self.dry,
					wet: self.wet
				};
			},
			settings = dawEngine.delaySettings;

		self.time = settings.time;
		self.feedback = settings.feedback;
		self.dry = settings.dry;
		self.wet = settings.wet;

		[
			"delay.time",
			"delay.feedback",
			"delay.dry",
			"delay.wet"
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
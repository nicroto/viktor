'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "ReverbCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.reverbSettings = {
					level: self.level
				};
			},
			settings = dawEngine.reverbSettings;

		self.level = settings.level;

		[
			"reverb.level"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix the lack of attr 'value' update
		$( ".reverb webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "reverb", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "reverb.html" )
		};
	} ] );

};
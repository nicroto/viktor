'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ReverbCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				dawEngine.reverbSettings = {
					level: settingsConvertor.transposeParam( self.level, settings.level.range )
				};
			},
			settings = dawEngine.reverbSettings;

		self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );

		[
			"reverb.level.value"
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
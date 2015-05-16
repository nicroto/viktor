'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ModulationWheelCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = settingsConvertor.transposeParam( self.modulation, settings.rate.range );

				dawEngine.modulationSettings = modulationSettings;
			},
			settings = dawEngine.modulationSettings,
			$modulationWheel = $( ".modulation-wheel webaudio-slider" );

		self.modulation = settingsConvertor.transposeParam( settings.rate, [ 0, 128 ] );

		[
			"modulationWheel.modulation.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
			if ( type === "modulationWheel" ) {
				$modulationWheel[ 0 ].setValue(
					settingsConvertor.transposeParam( parsed.modulation, self.modulation.range ).value
				);
			}
		} );

		// fix issue with initial value settings
		$timeout( function() {
			$modulationWheel[ 0 ].setValue( self.modulation.value );
		}, 500 );

		// fix the lack of attr 'value' update
		$modulationWheel.on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "modulationWheel", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "modulation-wheel.html" )
		};
	} ] );

};
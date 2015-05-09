'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "ModulationWheelCtrl", [ "$scope", "$timeout", "dawEngine", "synthUtils", function( $scope, $timeout, dawEngine, synthUtils ) {
		var self = this,
			settingsChangeHandler = function() {
				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = synthUtils.getRateFromSimpleModulation( self.modulation );

				dawEngine.modulationSettings = modulationSettings;
			},
			settings = dawEngine.modulationSettings,
			$modulationWheel = $( ".modulation-wheel webaudio-slider" );

		self.RANGE = 127;
		self.modulation = synthUtils.getSimpleModulationFromRate( settings.rate );

		[
			"modulationWheel.modulation"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		dawEngine.addExternalMidiMessageHandler( function( type, parsed, rawEvent ) {
			if ( type === "modulationWheel" ) {
				$modulationWheel[ 0 ].setValue(
					synthUtils.getSimpleModulationFromRate(
						synthUtils.getRateFromModulation( parsed.modulation )
					)
				);
			}
		} );

		// fix issue with initial value settings
		$timeout( function() {
			$modulationWheel[ 0 ].setValue( self.modulation );
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
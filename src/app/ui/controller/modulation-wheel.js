'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ModulationWheelCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = settingsConvertor.transposeValue( self.modulation, [ 0, 128 ], [ 0, 15 ] );

				dawEngine.modulationSettings = modulationSettings;
			},
			settings = dawEngine.modulationSettings,
			$modulationWheel = $( ".modulation-wheel webaudio-slider" );

		self.RANGE = 128;
		self.modulation = settingsConvertor.transposeValue( settings.rate, [ 0, 15 ], [ 0, 128 ] );

		[
			"modulationWheel.modulation"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
			if ( type === "modulationWheel" ) {
				$modulationWheel[ 0 ].setValue(
					settingsConvertor.transposeValue( parsed.modulation, [ 0, 1 ], [ 0, 128 ] )
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
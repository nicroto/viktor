'use strict';

var settingsConvertor = require( "settings-convertor" ),
	RATE_RANGE = [ 0, 128 ];

module.exports = function( mod ) {

	mod.controller( "ModulationWheelCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function() {
				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = settingsConvertor.transposeParam( self.modulation, settings.rate.range );

				dawEngine.modulationSettings = modulationSettings;
			},
			settings = dawEngine.modulationSettings;

		self.modulation = settingsConvertor.transposeParam( settings.rate, RATE_RANGE );

		[
			"modulationWheel.modulation.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );
	} ] );

	mod.directive( "modulationWheel", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "modulation-wheel.html" )
		};
	} ] );

	mod.directive( "modWheelValue", [ "dawEngine", function( dawEngine ) {

		return {
			restrict: "A",
			link: function( scope, $element, attrs ) {
				dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
					if ( type === "modulationWheel" ) {
						$element[ 0 ].setValue(
							settingsConvertor.transposeParam( parsed.modulation, RATE_RANGE ).value
						);
					}
				} );
			}
		};

	} ] );

};
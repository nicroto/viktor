'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" ),
	RATE_RANGE = [ 0, 128 ];

module.exports = function( mod ) {

	mod.controller( "ModulationWheelCtrl", [ "$scope", "$timeout", "dawEngine", function( $scope, $timeout, dawEngine ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				var modulationSettings = dawEngine.modulationSettings;

				modulationSettings.rate = settingsConvertor.transposeParam( self.modulation, settings.rate.range );

				dawEngine.modulationSettings = modulationSettings;
			},
			settings,
			pollSettings = function() {
				settings = dawEngine.modulationSettings;

				self.modulation = settingsConvertor.transposeParam( settings.rate, RATE_RANGE );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"modulationWheel.modulation.value"
				].forEach( function( path ) {
					watchers.push( $scope.$watch( path, settingsChangeHandler ) );
				} );
			},
			unregisterFromChanges = function() {
				watchers.forEach( function( unregister ) {
					unregister();
				} );
				watchers = [];
			};

		pollSettings();

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
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
			link: function( scope, $element ) {
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
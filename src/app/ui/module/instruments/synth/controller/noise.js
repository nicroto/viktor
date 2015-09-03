'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "NoiseCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.noiseSettings = {
					enabled: self.enabled,
					level: settingsConvertor.transposeParam( self.level, settings.level.range ),
					type: self.type
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.noiseSettings;

				self.enabled = settings.enabled;
				self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );
				self.type = settings.type;
			},
			watchers = [],
			registerForChanges = function() {
				[
					"noise.enabled.value",
					"noise.level.value",
					"noise.type.value"
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

	mod.directive( "noise", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "noise.html" )
		};
	} ] );

};
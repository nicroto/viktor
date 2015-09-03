'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "MixerCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.mixerSettings = {
					volume1: {
						enabled: self.volume1.enabled,
						level: settingsConvertor.transposeParam( self.volume1.level, settings.volume1.level.range )
					},
					volume2: {
						enabled: self.volume2.enabled,
						level: settingsConvertor.transposeParam( self.volume2.level, settings.volume2.level.range )
					},
					volume3: {
						enabled: self.volume3.enabled,
						level: settingsConvertor.transposeParam( self.volume3.level, settings.volume3.level.range )
					}
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.mixerSettings;

				self.volume1 = {
					enabled: settings.volume1.enabled,
					level: settingsConvertor.transposeParam( settings.volume1.level, [ 0, 100 ] )
				};
				self.volume2 = {
					enabled: settings.volume2.enabled,
					level: settingsConvertor.transposeParam( settings.volume2.level, [ 0, 100 ] )
				};
				self.volume3 = {
					enabled: settings.volume3.enabled,
					level: settingsConvertor.transposeParam( settings.volume3.level, [ 0, 100 ] )
				};
			},
			watchers = [],
			registerForChanges = function() {
				[
					"mixer.volume1.enabled.value",
					"mixer.volume1.level.value",
					"mixer.volume2.enabled.value",
					"mixer.volume2.level.value",
					"mixer.volume3.enabled.value",
					"mixer.volume3.level.value"
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

	mod.directive( "mixer", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "mixer.html" )
		};
	} ] );

};
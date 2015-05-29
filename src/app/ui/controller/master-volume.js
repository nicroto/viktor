'use strict';

var settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "MasterVolumeCtrl", [ "$scope", "$timeout", "dawEngine", "patchLibrary", function( $scope, $timeout, dawEngine, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.masterVolumeSettings = {
					level: settingsConvertor.transposeParam( self.level, settings.level.range )
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = dawEngine.masterVolumeSettings;
				self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"masterVolume.level.value"
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

	mod.directive( "masterVolume", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "master-volume.html" )
		};
	} ] );

};
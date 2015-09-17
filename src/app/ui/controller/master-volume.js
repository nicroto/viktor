'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" ),
	LEVEL_RANGE = [ 0, 100 ];

module.exports = function( mod ) {

	mod.controller( "MasterVolumeCtrl", [ "$scope", "dawEngine", "patchLibrary", function( $scope, dawEngine, patchLibrary ) {
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
				self.level = settingsConvertor.transposeParam( settings.level, LEVEL_RANGE );
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

	mod.directive( "masterVolumeValue", [ "$document", "dawEngine", function( $document, dawEngine ) {

		return {
			restrict: "A",
			link: function( scope, $element ) {
				dawEngine.addExternalMidiMessageHandler( function( type, parsed ) {
					if ( type === "volume" ) {
						$element[ 0 ].setValue(
							settingsConvertor.transposeParam( parsed.volume, LEVEL_RANGE ).value
						);
					}
				} );
			}
		};

	} ] );

};
'use strict';

module.exports = function( mod ) {

	mod.controller( "CompressorCtrl", [ "$scope", "dawEngine", "patchLibrary", function( $scope, dawEngine, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.compressorSettings = {
					enabled		: self.enabled,
					threshold	: self.threshold,
					ratio		: self.ratio,
					knee		: self.knee,
					attack		: self.attack,
					release		: self.release,
					makeupGain	: self.makeupGain
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = dawEngine.compressorSettings;

				self.enabled = settings.enabled;
				self.threshold = settings.threshold;
				self.ratio = settings.ratio;
				self.knee = settings.knee;
				self.attack = settings.attack;
				self.release = settings.release;
				self.makeupGain = settings.makeupGain;
			},
			watchers = [],
			registerForChanges = function() {
				[
					"compressor.enabled.value",
					"compressor.threshold.value",
					"compressor.ratio.value",
					"compressor.knee.value",
					"compressor.attack.value",
					"compressor.release.value",
					"compressor.makeupGain.value"
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

	mod.directive( "compressor", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "compressor.html" )
		};
	} ] );

};
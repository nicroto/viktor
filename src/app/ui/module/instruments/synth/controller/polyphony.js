'use strict';

module.exports = function( mod ) {

	mod.controller( "PolyphonyCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				settings = synth.polyphonySettings;

				synth.polyphonySettings = {
					voiceCount: self.voiceCount,
					sustain: settings.sustain
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.polyphonySettings;

				self.voiceCount = settings.voiceCount;
			},
			watchers = [],
			registerForChanges = function() {
				[
					"polyphony.voiceCount.value"
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

	// directive is defined in the modulation controller

};
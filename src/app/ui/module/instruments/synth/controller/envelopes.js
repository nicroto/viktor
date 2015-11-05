'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "EnvelopesCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.envelopesSettings = {
					primary: {
						reset: settingsConvertor.transposeParam( self.primary.reset, primary.reset.range ),
						start: settingsConvertor.transposeParam( self.primary.start, primary.start.range ),
						attack: settingsConvertor.transposeParam( self.primary.attack, primary.attack.range ),
						decay: settingsConvertor.transposeParam( self.primary.decay, primary.decay.range ),
						sustain: settingsConvertor.transposeParam( self.primary.sustain, primary.sustain.range ),
						release: settingsConvertor.transposeParam( self.primary.release, primary.release.range )
					},
					filter: {
						reset: settingsConvertor.transposeParam( self.filter.reset, filter.reset.range ),
						start: settingsConvertor.transposeParam( self.filter.start, filter.start.range ),
						attack: settingsConvertor.transposeParam( self.filter.attack, filter.attack.range ),
						decay: settingsConvertor.transposeParam( self.filter.decay, filter.decay.range ),
						sustain: settingsConvertor.transposeParam( self.filter.sustain, filter.sustain.range ),
						release: settingsConvertor.transposeParam( self.filter.release, filter.release.range )
					}
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			primary,
			filter,
			pollSettings = function() {
				settings = synth.envelopesSettings;
				primary = settings.primary;
				filter = settings.filter;

				self.primary = {
					reset: settingsConvertor.transposeParam( primary.reset, [ 0, 100 ] ),
					start: settingsConvertor.transposeParam( primary.start, [ 0, 100 ] ),
					attack: settingsConvertor.transposeParam( primary.attack, [ 0, 100 ] ),
					decay: settingsConvertor.transposeParam( primary.decay, [ 0, 100 ] ),
					sustain: settingsConvertor.transposeParam( primary.sustain, [ 0, 100 ] ),
					release: settingsConvertor.transposeParam( primary.release, [ 0, 100 ] )
				};
				self.filter = {
					reset: settingsConvertor.transposeParam( filter.reset, [ 0, 100 ] ),
					start: settingsConvertor.transposeParam( filter.start, [ 0, 100 ] ),
					attack: settingsConvertor.transposeParam( filter.attack, [ 0, 100 ] ),
					decay: settingsConvertor.transposeParam( filter.decay, [ 0, 100 ] ),
					sustain: settingsConvertor.transposeParam( filter.sustain, [ 0, 100 ] ),
					release: settingsConvertor.transposeParam( filter.release, [ 0, 100 ] )
				};
			},
			watchers = [],
			registerForChanges = function() {
				[
					"envs.primary.reset.value",
					"envs.primary.start.value",
					"envs.primary.attack.value",
					"envs.primary.decay.value",
					"envs.primary.sustain.value",
					"envs.primary.release.value",
					"envs.filter.reset.value",
					"envs.filter.start.value",
					"envs.filter.attack.value",
					"envs.filter.decay.value",
					"envs.filter.sustain.value",
					"envs.filter.release.value"
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

	mod.directive( "envelopes", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "envelopes.html" )
		};
	} ] );

};
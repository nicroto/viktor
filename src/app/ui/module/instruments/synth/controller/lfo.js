'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "LFOCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.lfoSettings = {
					waveform: self.waveform,
					rate: self.rate,
					amount: settingsConvertor.transposeParam( self.amount, settings.amount.range )
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.lfoSettings;

				self.waveform = settings.waveform;
				self.rate = settings.rate;
				self.amount = settingsConvertor.transposeParam( settings.amount, [ 0, 100 ] );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"lfo.waveform.value",
					"lfo.rate.value",
					"lfo.amount.value"
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

	mod.directive( "lfo", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "lfo.html" )
		};
	} ] );

};
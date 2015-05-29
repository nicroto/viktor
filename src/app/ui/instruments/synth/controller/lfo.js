'use strict';

var settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "LFOCtrl", [ "$scope", "$timeout", "dawEngine", "synth", "patchLibrary", function( $scope, $timeout, dawEngine, synth, patchLibrary ) {
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
			pollSettings = function( time ) {
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

		pollSettings( 300 );

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
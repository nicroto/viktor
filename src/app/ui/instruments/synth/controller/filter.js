'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "FilterCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.filterSettings = {
					cutoff: settingsConvertor.transposeParam( self.cutoff, settings.cutoff.range ),
					emphasis: settingsConvertor.transposeParam( self.emphasis, settings.emphasis.range ),
					envAmount: settingsConvertor.transposeParam( self.envAmount, settings.envAmount.range )
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.filterSettings;

				self.cutoff = settingsConvertor.transposeParam( settings.cutoff, [ 0, 500 ] );
				self.emphasis = settingsConvertor.transposeParam( settings.emphasis, [ 1, 100 ] );
				self.envAmount = settingsConvertor.transposeParam( settings.envAmount, [ 0, 100 ] );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"filter.cutoff.value",
					"filter.emphasis.value",
					"filter.envAmount.value"
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

		// fix the lack of attr 'value' update
		$( ".filter webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "filter", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "filter.html" )
		};
	} ] );

};
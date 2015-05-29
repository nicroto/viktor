'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "FilterCtrl", [ "$scope", "$timeout", "dawEngine", "synth", "patchLibrary", function( $scope, $timeout, dawEngine, synth, patchLibrary ) {
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
			pollSettings = function( time ) {
				settings = synth.filterSettings;

				self.cutoff = settingsConvertor.transposeParam( settings.cutoff, [ 0, 500 ] );
				self.emphasis = settingsConvertor.transposeParam( settings.emphasis, [ 1, 100 ] );
				self.envAmount = settingsConvertor.transposeParam( settings.envAmount, [ 0, 100 ] );

				// fix problem with bad init state
				$timeout( function() {
					$knobs.each( function( index, element ) {
						element.redraw();
					} );
				}, time );
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
			},
			$knobs = $( ".filter webaudio-knob" );

		pollSettings( 300 );

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
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
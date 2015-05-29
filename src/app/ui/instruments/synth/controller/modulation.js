'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ModulationCtrl", [ "$scope", "$timeout", "dawEngine", "synth", "patchLibrary", function( $scope, $timeout, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.modulationSettings = {
					waveform: self.waveform,
					portamento: settingsConvertor.transposeParam( self.portamento, settings.portamento.range ),
					rate: synth.modulationSettings.rate
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function( time ) {
				settings = synth.modulationSettings;

				self.waveform = settings.waveform;
				self.portamento = settingsConvertor.transposeParam( settings.portamento, [ 0, 100 ] );

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
					"modulation.waveform.value",
					"modulation.portamento.value"
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
			$knobs = $( ".modulation webaudio-knob" );

		pollSettings( 300 );

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
		} );
	} ] );

	mod.directive( "modulation", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "modulation.html" )
		};
	} ] );

};
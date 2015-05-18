'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ModulationCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
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
			pollSettings = function() {
				settings = synth.modulationSettings;

				self.waveform = settings.waveform;
				self.portamento = settingsConvertor.transposeParam( settings.portamento, [ 0, 100 ] );
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
			};

		pollSettings();

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
		} );

		// fix the lack of attr 'value' update
		$( ".modulation webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
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
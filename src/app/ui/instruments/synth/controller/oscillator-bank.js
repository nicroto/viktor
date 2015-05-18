'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "OscillatorBankCtrl", [ "$scope", "dawEngine", "synth", "patchLibrary", function( $scope, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.oscillatorSettings = {
					osc1: {
						range: settingsConvertor.transposeParam( self.osc1.range, settings.osc1.range.range ),
						fineDetune: settingsConvertor.transposeParam( self.osc1.fineDetune, settings.osc1.fineDetune.range ),
						waveform: self.osc1.waveform
					},
					osc2: {
						range: settingsConvertor.transposeParam( self.osc2.range, settings.osc2.range.range ),
						fineDetune: settingsConvertor.transposeParam( self.osc2.fineDetune, settings.osc2.fineDetune.range ),
						waveform: self.osc2.waveform
					},
					osc3: {
						range: settingsConvertor.transposeParam( self.osc3.range, settings.osc3.range.range ),
						fineDetune: settingsConvertor.transposeParam( self.osc3.fineDetune, settings.osc3.fineDetune.range ),
						waveform: self.osc3.waveform
					}
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings  = synth.oscillatorSettings;

				self.osc1 = {
					range: settingsConvertor.transposeParam( settings.osc1.range, [ 0, 6 ] ),
					fineDetune: settingsConvertor.transposeParam( settings.osc1.fineDetune, [ 0, 16 ] ),
					waveform: settings.osc1.waveform
				};
				self.osc2 = {
					range: settingsConvertor.transposeParam( settings.osc2.range, [ 0, 6 ] ),
					fineDetune: settingsConvertor.transposeParam( settings.osc2.fineDetune, [ 0, 16 ] ),
					waveform: settings.osc2.waveform
				};
				self.osc3 = {
					range: settingsConvertor.transposeParam( settings.osc3.range, [ 0, 6 ] ),
					fineDetune: settingsConvertor.transposeParam( settings.osc3.fineDetune, [ 0, 16 ] ),
					waveform: settings.osc3.waveform
				};
			},
			watchers = [],
			registerForChanges = function() {
				[
					"oscillators.osc1.range.value",
					"oscillators.osc1.waveform.value",
					"oscillators.osc2.range.value",
					"oscillators.osc2.fineDetune.value",
					"oscillators.osc2.waveform.value",
					"oscillators.osc3.range.value",
					"oscillators.osc3.fineDetune.value",
					"oscillators.osc3.waveform.value"
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

		$( ".oscillator webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "oscillatorBank", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "oscillator-bank.html" )
		};
	} ] );

};
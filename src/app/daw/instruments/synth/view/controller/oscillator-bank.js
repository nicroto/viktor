'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "OscillatorBankCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.oscillatorSettings = {
					osc1: self.osc1,
					osc2: self.osc2,
					osc3: self.osc3
				};
			},
			settings = synth.oscillatorSettings;

		self.osc1 = settings.osc1;
		self.osc2 = settings.osc2;
		self.osc3 = settings.osc3;

		[
			"oscillators.osc1.range",
			"oscillators.osc1.waveform",
			"oscillators.osc2.range",
			"oscillators.osc2.fineDetune",
			"oscillators.osc2.waveform",
			"oscillators.osc3.range",
			"oscillators.osc3.fineDetune",
			"oscillators.osc3.waveform"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
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
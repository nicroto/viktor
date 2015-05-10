'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "ModulationCtrl", [ "$scope", "synth", function( $scope, synth ) {
		var self = this,
			settingsChangeHandler = function() {
				synth.modulationSettings = {
					waveform: self.waveform,
					portamento: self.portamento,
					rate: synth.modulationSettings.rate
				};
			},
			settings = synth.modulationSettings;

		self.waveform = settings.waveform;
		self.portamento = settings.portamento;

		[
			"modulation.waveform",
			"modulation.portamento"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
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
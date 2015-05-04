'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "LFOCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.lfoSettings = {
					waveform: self.waveform,
					rate: self.rate,
					amount: self.amount
				};
			},
			settings = synth.lfoSettings;

		self.waveform = settings.waveform;
		self.rate = settings.rate;
		self.amount = settings.amount;

		[
			"lfo.waveform",
			"lfo.rate",
			"lfo.amount"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix the lack of attr 'value' update
		$( ".lfo webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
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
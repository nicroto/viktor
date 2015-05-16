'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "LFOCtrl", [ "$scope", "synth", function( $scope, synth ) {
		var self = this,
			settingsChangeHandler = function() {
				synth.lfoSettings = {
					waveform: self.waveform,
					rate: self.rate,
					amount: settingsConvertor.transposeParam( self.amount, settings.amount.range )
				};
			},
			settings = synth.lfoSettings;

		self.waveform = settings.waveform;
		self.rate = settings.rate;
		self.amount = settingsConvertor.transposeParam( settings.amount, [ 0, 100 ] );

		[
			"lfo.waveform.value",
			"lfo.rate.value",
			"lfo.amount.value"
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
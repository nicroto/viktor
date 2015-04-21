'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "ModulationCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.modulationSettings = {
					portamento: self.portamento,
					mix: self.mix
				};
			},
			settings = synth.modulationSettings;

		self.portamento = settings.portamento;
		self.mix = settings.mix;

		[
			"modulation.portamento",
			"modulation.mix"
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
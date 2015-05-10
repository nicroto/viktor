'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "FilterCtrl", [ "$scope", "synth", function( $scope, synth ) {
		var self = this,
			settingsChangeHandler = function() {
				synth.filterSettings = {
					cutoff: self.cutoff,
					emphasis: self.emphasis,
					envAmount: self.envAmount
				};
			},
			settings = synth.filterSettings;

		self.cutoff = settings.cutoff;
		self.emphasis = settings.emphasis;
		self.envAmount = settings.envAmount;

		[
			"filter.cutoff",
			"filter.emphasis",
			"filter.envAmount"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
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
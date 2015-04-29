'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "FilterCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.filterSettings = {
					cutoff: self.cutoff,
					emphasis: self.emphasis
				};
			},
			settings = synth.filterSettings;

		self.cutoff = settings.cutoff;
		self.emphasis = settings.emphasis;

		[
			"filter.cutoff",
			"filter.emphasis"
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
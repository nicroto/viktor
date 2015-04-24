'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "EnvelopesCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.envelopesSettings = {
					primary: self.primary,
					filter: self.filter
				};
			},
			settings = synth.envelopesSettings;

		self.primary = settings.primary;
		self.filter = settings.filter;

		[
			"envs.primary.attack",
			"envs.primary.decay",
			"envs.primary.sustain",
			"envs.primary.release",
			"envs.filter.attack",
			"envs.filter.decay",
			"envs.filter.sustain",
			"envs.filter.release"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix the lack of attr 'value' update
		$( ".envelopes webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "envelopes", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "envelopes.html" )
		};
	} ] );

};
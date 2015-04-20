'use strict';

var $ = require( "jquery" );

module.exports = function( mod ) {

	mod.controller( "MixerCtrl", [ "$scope", "dawEngine", function( $scope, dawEngine ) {
		var self = this,
			synth = dawEngine.synth,
			settingsChangeHandler = function() {
				synth.mixerSettings = {
					volume1: self.volume1,
					volume2: self.volume2,
					volume3: self.volume3,
					noise: self.noise
				};
			},
			settings = synth.mixerSettings;

		self.volume1 = settings.volume1;
		self.volume2 = settings.volume2;
		self.volume3 = settings.volume3;
		self.noise = settings.noise;

		[
			"mixer.volume1.isEnabled",
			"mixer.volume1.value",
			"mixer.volume2.isEnabled",
			"mixer.volume2.value",
			"mixer.volume3.isEnabled",
			"mixer.volume3.value",
			"mixer.noise.type",
			"mixer.noise.volume"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix problem with bad init state
		$( ".mixer .oscillator-switch webaudio-switch" )[ 0 ].setValue( self.volume1.isEnabled );

		// fix the lack of attr 'value' update
		$( ".mixer webaudio-switch" )
			.add( ".mixer webaudio-knob" )
			.add( ".mixer webaudio-slider" )
		.on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "mixer", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "mixer.html" )
		};
	} ] );

};
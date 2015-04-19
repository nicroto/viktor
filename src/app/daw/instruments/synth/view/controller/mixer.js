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
					volume3: self.volume3
				};
			},
			settings = synth.mixerSettings;

		self.volume1 = {
			isEnabled: 1,
			value: 60
		};
		self.volume2 = {
			isEnabled: 0,
			value: 60
		};
		self.volume3 = {
			isEnabled: 0,
			value: 60
		};

		[
			"mixer.volume1.isEnabled",
			"mixer.volume1.value",
			"mixer.volume2.isEnabled",
			"mixer.volume2.value",
			"mixer.volume3.isEnabled",
			"mixer.volume3.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix problem with bad init state
		$( ".mixer .volume:first-child webaudio-switch" )[ 0 ].setValue( self.volume1.isEnabled );

		// fix the lack of attr 'value' update
		$( ".volume webaudio-switch" ).add( ".volume webaudio-knob" ).on( "change", function( e ) {
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
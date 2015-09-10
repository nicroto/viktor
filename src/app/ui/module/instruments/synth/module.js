'use strict';

var angular = require( "angular" ),
	template = require( "./template/synth.html" ),
	mod = angular.module( "synth", [
		template.name,
		require( "./template/modulation+polyphony.html" ).name,
		require( "./template/oscillator-bank.html" ).name,
		require( "./template/mixer.html" ).name,
		require( "./template/noise.html" ).name,
		require( "./template/envelopes.html" ).name,
		require( "./template/filter.html" ).name,
		require( "./template/lfo.html" ).name
	] );

mod.directive( "synth", [ "$templateCache", function( $templateCache ) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Controllers
require( "./controller/polyphony" )( mod );
require( "./controller/modulation" )( mod );
require( "./controller/oscillator-bank" )( mod );
require( "./controller/mixer" )( mod );
require( "./controller/noise" )( mod );
require( "./controller/envelopes" )( mod );
require( "./controller/filter" )( mod );
require( "./controller/lfo" )( mod );

module.exports = mod;
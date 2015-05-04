'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/synth.html" ),
	mod = angular.module( "synth", [
		template.name,
		require( "./view/template/modulation.html" ).name,
		require( "./view/template/oscillator-bank.html" ).name,
		require( "./view/template/mixer.html" ).name,
		require( "./view/template/envelopes.html" ).name,
		require( "./view/template/filter.html" ).name,
		require( "./view/template/lfo.html" ).name
	] );

mod.directive( "synth", [ "$templateCache", function( $templateCache ) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Controllers
require( "./view/controller/modulation" )( mod );
require( "./view/controller/oscillator-bank" )( mod );
require( "./view/controller/mixer" )( mod );
require( "./view/controller/envelopes" )( mod );
require( "./view/controller/filter" )( mod );
require( "./view/controller/lfo" )( mod );

module.exports = mod;
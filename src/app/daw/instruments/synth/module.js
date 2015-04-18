'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/synth.html" ),
	mod = angular.module( "synth", [
		template.name,
		require( "./view/template/oscillator-bank.html" ).name
		//... require all template used within the module
	] );

mod.directive( "synth", [ "$templateCache", function( $templateCache ) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Controllers
require( "./view/controller/oscillator-bank" )( mod );

module.exports = mod;
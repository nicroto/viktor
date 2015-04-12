'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/daw.html" ),
	mod = angular.module( "dawModule", [
		require( "./instruments/synth/module" ).name,
		template.name
	] ),
	DAW = require( "./daw" );

mod.factory( "daw", function() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;

	var daw = new DAW( AudioContext );

	return daw;
} );

mod.directive( "dawContainer", [ "$templateCache", function($templateCache) {
	return {
		restrict: "E",
		template: $templateCache.get( template.name )
	};
} ] );

module.exports = mod;
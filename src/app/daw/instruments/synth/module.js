'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/synth.html" ),
	mod = angular.module( "synth", [
		template.name
	] );

mod.directive( "synth", [ "$templateCache", function( $templateCache ) {
	return {
		restrict: "E",
		template: $templateCache.get( template.name )
	};
} ] );

mod.controller( "synthCtrl", function() {

} );

module.exports = mod;
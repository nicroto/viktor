'use strict';

var angular = require( "angular" ),
	template = require( "./template/patch-library.html" ),
	mod = angular.module( "patch-library", [
		template.name,
		require( "./template/drop-down.html" ).name
	] );

mod.directive( "patchLibrary", [ "$templateCache", function( $templateCache ) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Controllers
require( "./controller/drop-down" )( mod );

module.exports = mod;
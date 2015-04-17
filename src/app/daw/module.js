'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/daw.html" ),
	mod = angular.module( "dawModule", [
		require( "./instruments/synth/module" ).name,
		template.name
	] );

mod.provider( "dawEngine", function dawEngineProvider() {

	var self = this;

	self.dawEngine = null;

	self.$get = function dawEngineFactory() {
		return self.dawEngine;
	};

} );

mod.directive( "dawContainer", [ "$templateCache", function($templateCache) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Controllers
require( "./view/controller/master" )( mod );
require( "./view/controller/keyboard" )( mod );

module.exports = mod;
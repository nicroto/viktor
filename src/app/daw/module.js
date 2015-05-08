'use strict';

var angular = require( "angular" ),
	template = require( "./view/template/daw.html" ),
	mod = angular.module( "dawModule", [
		template.name,
		require( "./instruments/synth/module" ).name,
		require( "./view/template/master-controls.html" ).name,
		require( "./view/template/delay.html" ).name,
		require( "./view/template/reverb.html" ).name,
		require( "./view/template/master-volume.html" ).name,
		require( "./view/template/pitch-bend.html" ).name,
		require( "./view/template/modulation-wheel.html" ).name,
		require( "./view/template/keyboard.html" ).name
	] );

mod.provider( "dawEngine", function dawEngineProvider() {

	var self = this;

	self.dawEngine = null;

	self.$get = function dawEngineFactory() {
		return self.dawEngine;
	};

} );

mod.factory( "synthUtils", function() {
	return require( "./instruments/synth/engine/utils" );
} );

mod.directive( "dawContainer", [ "$templateCache", function($templateCache) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Directives (without a controller)
require( "./view/controller/master-controls" )( mod );

// Controllers
require( "./view/controller/delay" )( mod );
require( "./view/controller/reverb" )( mod );
require( "./view/controller/master-volume" )( mod );
require( "./view/controller/pitch-bend" )( mod );
require( "./view/controller/modulation-wheel" )( mod );
require( "./view/controller/keyboard" )( mod );

module.exports = mod;
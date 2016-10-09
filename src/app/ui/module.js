'use strict';

var angular = require( "angular" ),
	template = require( "./template/daw.html" ),
	mod = angular.module( "dawModule", [
		template.name,
		require( "./module/settings/module" ).name,
		require( "./module/patch-library/module" ).name,
		require( "./module/instruments/synth/module" ).name,
		require( "./module/footer/module" ).name,
		require( "./module/t-shirts/module" ).name,

		require( "./template/master-controls.html" ).name,
		require( "./template/compressor.html" ).name,
		require( "./template/delay.html" ).name,
		require( "./template/reverb.html" ).name,
		require( "./template/master-volume.html" ).name,
		require( "./template/pitch-bend.html" ).name,
		require( "./template/modulation-wheel.html" ).name,
		require( "./template/keyboard.html" ).name
	] ),
	Synth = require( "viktor-nv1-engine" ).Synth,
	synth;

mod.provider( "dawEngine", function dawEngineProvider() {

	var self = this;

	self.dawEngine = null;

	self.$get = function dawEngineFactory() {
		return self.dawEngine;
	};

} );

mod.factory( "synth",[ "dawEngine", function( dawEngine ) {
	if ( !synth ) {
		dawEngine.instruments.forEach( function( instrument ) {
			if ( instrument instanceof Synth ) {
				// cache the instance
				synth = instrument;
			}
		} );
	}

	return synth;
} ] );

mod.directive( "dawContainer", [ "$templateCache", function($templateCache) {
	return {
		restrict: "E",
		replace: true,
		template: $templateCache.get( template.name )
	};
} ] );

// Directives (without a controller)
require( "./controller/master-controls" )( mod );

// Controllers
require( "./controller/compressor" )( mod );
require( "./controller/delay" )( mod );
require( "./controller/reverb" )( mod );
require( "./controller/master-volume" )( mod );
require( "./controller/pitch-bend" )( mod );
require( "./controller/modulation-wheel" )( mod );
require( "./controller/keyboard" )( mod );

module.exports = mod;
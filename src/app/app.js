'use strict';

var angular = require( "angular" ),
	store = require( "store" ),
	app = angular.module( "app", [
		require( "angular-bind-polymer" ).name,
		require( "./ui/module" ).name
	] ),
	DAW = require( "./daw/daw" ),
	AudioContext = global.AudioContext || global.webkitAudioContext,
	PatchLibrary = require( "./patches/library" ),
	patchLibrary = new PatchLibrary( "VIKTOR_SYNTH", require( "./patches/defaults" ), store ),
	dawEngine = new DAW(
		AudioContext,
		[
			require( "./instruments/synth/instrument" )
		],
		patchLibrary.getSelected().patch
	);

// !!! DEFFERS THE BOOTSTRAP !!!
global.name = "NG_DEFER_BOOTSTRAP!";

app.config( [ "dawEngineProvider", function( dawEngineProvider ) {
	dawEngineProvider.dawEngine = dawEngine;
} ] );

app.factory( "patchLibrary", function() {
	return patchLibrary;
} );

angular.element( document ).ready( function() {

	dawEngine.init( function() {

		// !!! BOOTSTRAP !!!
		angular.resumeBootstrap();

	} );

} );

module.exports = app;
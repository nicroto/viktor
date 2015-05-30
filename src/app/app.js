'use strict';

var angular = require( "angular" ),
	store = require( "store" ),
	app = angular.module( "app", [
		require( "angular-bootstrap-npm" ),
		require( "ng-file-upload" ).name,
		require( "angular-bind-polymer" ).name,
		require( "./ui/fixes" ).name,
		require( "./ui/module" ).name
	] ),
	DAW = require( "./daw/daw" ),
	AudioContext = global.AudioContext || global.webkitAudioContext,
	PatchLibrary = require( "./patches/library" ),
	patchLibrary = new PatchLibrary( "VIKTOR_SYNTH", require( "./patches/defaults" ), store ),
	is_iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
	dawEngine,
	bootstrap = function() {
		dawEngine = new DAW(
			AudioContext,
			[
				require( "./instruments/synth/instrument" )
			],
			patchLibrary.getSelected().patch
		);

		dawEngine.init( function() {

			// !!! BOOTSTRAP !!!
			angular.resumeBootstrap();

		} );
	};

// !!! DEFFERS THE BOOTSTRAP !!!
global.name = "NG_DEFER_BOOTSTRAP!";

app.config( [ "dawEngineProvider", function( dawEngineProvider ) {
	dawEngineProvider.dawEngine = dawEngine;
} ] );

app.factory( "patchLibrary", function() {
	return patchLibrary;
} );

angular.element( document ).ready( function() {
	var $button = angular.element( document.querySelector( "#loadSynthButton" ) );

	if ( is_iOS ) {
		$button.removeClass( "hide" );
		$button.one( "click", function() {
			$button.remove();
			bootstrap();
		} );		
	} else {
		$button.remove();
		bootstrap();
	}
} );

module.exports = app;
'use strict';

var angular = require( "angular" ),
	store = require( "store" ),
	app = angular.module( "app", [
		require( "angular-bootstrap-npm" ),
		require( "ng-file-upload" ).name,
		require( "angular-bind-polymer" ).name,
		require( "./ui/fixes" ).name,
		require( "./ui/module" ).name,
		require( "./3rd-party/google-api/module" ).name
	] ),
	NV1Engine = require( "viktor-nv1-engine" ),
	patchSharing = require( "non-npm-patch-sharing" ),
	AudioContext = global.AudioContext || global.webkitAudioContext,
	is_iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
	queryString = window.location.search.substr( 1 ),
	dawEngine,
	patchLibrary,
	bootstrap = function() {
		var result = NV1Engine.create( AudioContext, store );

		dawEngine = result.dawEngine;
		patchLibrary = result.patchLibrary;

		patchSharing.resolvePatchSelection( queryString, patchLibrary );

		dawEngine.loadPatch( patchLibrary.getSelected().patch );

		// !!! BOOTSTRAP !!!
		angular.resumeBootstrap();
	};

// !!! DEFFERS THE BOOTSTRAP !!!
global.name = "NG_DEFER_BOOTSTRAP!";

app.config( [ "dawEngineProvider", function( dawEngineProvider ) {
	dawEngineProvider.dawEngine = dawEngine;
} ] );

app.factory( "patchSharing", function() {
	return patchSharing;
} );

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
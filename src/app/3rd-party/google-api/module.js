'use strict';

var angular = require( "angular" ),
	GLOBALS = require( "globals" ),
	mod = angular.module( "google-api", [] );

mod.run( [ "$window", "googleApi", function( $window, googleApi ) {

	$window.initGoogleApiAngular = function() {
		var gapi = $window.gapi;

		gapi.client.setApiKey( GLOBALS.GOOGLE_API_KEY );
		gapi.client.load( 'urlshortener', 'v1' ).then( function() {
			console.log( "Google API loaded!" );
			googleApi.api = gapi;
			googleApi.loaded = true;
		} );
	};

} ] );

mod.service( "googleApi",[ function() {
	var self = this;

	self.loaded = false;
	self.api = null;
} ] );

module.exports = mod;
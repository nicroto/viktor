'use strict';

var GOOGLE_API_KEY = "AIzaSyA_ZvkfZiWe1uJlRbuXpWsSqYGV523Vvps";

var angular = require( "angular" ),
	mod = angular.module( "google-api", [] );

mod.run( [ "$window", "googleApi", function( $window, googleApi ) {

	$window.initGoogleApiAngular = function() {
		var gapi = $window.gapi;

		gapi.client.setApiKey( GOOGLE_API_KEY );
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
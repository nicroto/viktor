'use strict';

var angular = require( "angular" ),
	DAW = require( "./daw/daw" ),
	Synth = require( "./synth/instrument" ),
	AudioContext = window.AudioContext || window.webkitAudioContext,
	app = angular.module( "app", [
		require( "angular-local-storage" ).name
	] );

app.run( function( localStorageService ) {

	if ( !localStorageService.get( "lastVisit" ) ) {
		angular.element( "body" ).text( "Hello stranger!" );
	} else {
		angular.element( "body" ).text( "Welcome back!" );
	}

	localStorageService.set( "lastVisit", new Date() );

	var daw = new DAW( AudioContext );

	daw.init( function() {

		daw.addInstrument( Synth );

	} );

} );

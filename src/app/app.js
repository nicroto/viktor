'use strict';

var angular = require( "angular" ),
	app = angular.module( "app", [
		require( "./daw/module" ).name
	] );

app.run( [ "dawEngine", function( daw ) {
	daw.init();
} ] );

module.exports = app;
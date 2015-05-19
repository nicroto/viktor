'use strict';

var angular = require( "angular" ),
	mod = angular.module( "patch-library", [
		require( "./template/patch-library.html" ).name,
		require( "./template/drop-down.html" ).name
	] );

// Controllers
require( "./controller/patch-library" )( mod );
require( "./controller/drop-down" )( mod );

module.exports = mod;
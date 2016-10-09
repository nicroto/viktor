'use strict';

var angular = require( "angular" ),
	mod = angular.module( "t-shirts", [
		require( "./template/t-shirts.html" ).name
	] );

// Controllers
require( "./controller/t-shirts" )( mod );

module.exports = mod;
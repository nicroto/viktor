'use strict';

var angular = require( "angular" ),
	template = require( "./template/typed-ad.html" ),
	mod = angular.module( "typed-ad", [
		template.name
	] );

// Controllers
require( "./controller/typed-ad" )( mod );

module.exports = mod;
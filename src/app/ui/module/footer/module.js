'use strict';

var angular = require( "angular" ),
	template = require( "./template/footer.html" ),
	mod = angular.module( "footerModule", [
		template.name
	] );

// Controllers
require( "./controller/footer" )( mod );

module.exports = mod;
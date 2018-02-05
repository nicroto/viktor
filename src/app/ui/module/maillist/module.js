'use strict';

var angular = require( "angular" ),
	template = require( "./template/maillist.html" ),
	mod = angular.module( "maillistModule", [
		template.name
	] );

// Controllers
require( "./controller/maillist" )( mod );

module.exports = mod;
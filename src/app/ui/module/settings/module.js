'use strict';

var angular = require( "angular" ),
    mod = angular.module( "settings", [
        require( "./template/settings.html" ).name
    ] );

// Controllers
require( "./controller/settings" )( mod );

module.exports = mod;
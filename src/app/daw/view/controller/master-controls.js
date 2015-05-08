'use strict';

module.exports = function( mod ) {

	mod.directive( "masterControls", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "master-controls.html" )
		};
	} ] );

};
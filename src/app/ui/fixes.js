'use strict';

var angular = require( "angular" ),
	mod = angular.module( "fixes", [] );

mod.directive( "updateNumberValue", function() {

	return {
		restrict: "A",
		link: function( scope, element, attrs ) {
			angular.element( element ).on( "change", function( e ) {
				var $element = angular.element( e.target );
				if ( parseFloat( $element.attr( "value" ) ) !== e.target.value ) {
					$element.attr( "value", e.target.value );
				}
			} );
		}
	};

} );

module.exports = mod;
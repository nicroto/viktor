'use strict';

var angular = require( "angular" ),
	mod = angular.module( "fixes", [] );

mod.directive( "updateNumberValue", function() {

	return {
		restrict: "A",
		link: function( scope, element ) {
			angular.element( element ).on( "change", function( e ) {
				var $element = angular.element( e.target );
				if ( parseFloat( $element.attr( "value" ) ) !== e.target.value ) {
					$element.attr( "value", e.target.value );
				}
			} );
		}
	};

} );

mod.directive( "knobRedraw", [ "$document", function( $document ) {

	return {
		restrict: "A",
		link: function( scope, $element, attrs ) {
			var tryRedraw = function( $element ) {
				var element = $element[ 0 ];
				if ( element.redraw && "function" === typeof( element.redraw ) ) {
					element.redraw();
				}
			};

			$document.bind( "WebComponentsReady", function() {
				tryRedraw( $element );
			} );
			attrs.$observe( "value", function() {
				tryRedraw( $element );
			} );

		}
	};

} ] );

mod.directive( "updateControlValue", [ "$document", function( $document ) {

	return {
		restrict: "A",
		link: function( scope, $element, attrs ) {
			var trySet = function( $element, newValue ) {
				var control = $element.length && $element[ 0 ];
				if ( control && control.setValue && "function" === typeof( control.setValue ) ) {
					control.setValue( newValue );
				}
			};

			$document.bind( "WebComponentsReady", function() {
				trySet( $element, parseFloat( $element.attr( "value" ) ) );
			} );
			attrs.$observe( "value", function( newValueStr ) {
				trySet( $element, parseFloat( newValueStr ) );
			} );
		}
	};

} ] );

module.exports = mod;
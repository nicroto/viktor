/* jshint -W098 */

'use strict';

var angular = require( "angular" ),
	stats = {
		startTime: new Date (),
		timesOpened: 0,
		shirtsLookedUp: 0
	};

module.exports = function( mod ) {

	mod.controller( "TShirtsCtrl", [ "$scope", "$modal", function( $scope, $modal ) {
		var self = this;

		self.openTShirtsModal = function() {
			$modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'tShirtsModal.html',
				controller: 'TShirtsModalCtrl',
				controllerAs: 'tShirtsModal',
				size: null
			} );
		};
	} ] );

	mod.controller( "TShirtsModalCtrl", [ "$modalInstance", function( $modalInstance ) {
		var self = this;

		self.close = function() {
			$modalInstance.dismiss();
		};
	} ] );

	mod.directive( "tShirts", [ "$templateCache", "$interval", "$timeout",
	function( $templateCache, $interval, $timeout ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "t-shirts.html" ),
			link: function( scope, $element, attrs ) {
				var $button = angular.element( $element[ 0 ].querySelector(
						"a.t-shirts-button"
					) );

				$button.on( "click", function() {
					var currentTime = new Date(),
						seconds = Math.round( ( ( currentTime - stats.startTime ) / 1000 ) ),
						eventLabel = "Shirts shown for " +
							( ++stats.timesOpened ) +
							" time, " + seconds +
							"s";

					$timeout( function() {
						ga( "send", {
							"hitType": "event",
							"eventCategory": "T-Shirts",
							"eventAction": "show",
							"eventLabel": eventLabel
						} );
					}, 1 ); // just not to block links
				} );

				$timeout( function() {
					$interval( function() {
						$button.removeClass( "animate-button" );
						$button.addClass( "animate-button" );

						$timeout( function() {
							$button.removeClass( "animate-button" );
						}, 400 );

						$timeout( function() {
							$button.addClass( "animate-button" );
						}, 800 );

						$timeout( function() {
							$button.removeClass( "animate-button" );
						}, 1200 );
					}, 20000 );
				}, 60000 );
			}
		};
	} ] );

	mod.directive( "tShirtsStats", [ "$templateCache", "$timeout",
	function( $templateCache, $timeout ) {
		return {
			restrict: "A",
			replace: false,
			link: function( scope, $element, attrs ) {
				var $buttons = angular.element( $element[ 0 ].querySelectorAll(
						".t-shirt a.t-shirt-link"
					) );

				$buttons.on( "click", function() {
					var currentTime = new Date(),
						seconds = Math.round( ( ( currentTime - stats.startTime ) / 1000 ) ),
						eventLabel = "Looking up " +
							( ++stats.shirtsLookedUp ) +
							" shirts, in " + seconds +
							"s";

					$timeout( function() {
						ga( "send", {
							"hitType": "event",
							"eventCategory": "T-Shirts",
							"eventAction": "lookup",
							"eventLabel": eventLabel
						} );
					}, 1 ); // just not to block links
				} );
			}
		};
	} ] );

};
'use strict';


var Typed = require( "typedjs" );


module.exports = function( mod ) {

	mod.controller( "TypedAdController", [ "$scope", function ($scope) {

		$scope.options = {
			strings: [
				"Hey there!",
				"Do you want to build your own synth?",
				"Click HERE to make an inquiry!"
			],
			typeSpeed: 80,
			startDelay: 1200,
			smartBackspace: true,
			backDelay: 5000,
			loop: true,
			showCursor: false
		};
	} ] );

	mod.directive( "typedAd", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "typed-ad.html" ),
			link: function ( $scope ) {

				$scope.typedObj = new Typed ( ".type-in-here", $scope.options);
			}
		};
	} ] );
};
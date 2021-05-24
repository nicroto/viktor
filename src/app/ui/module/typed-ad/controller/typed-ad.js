'use strict';


var Typed = require( "typedjs" );

var ADS = [

	{
		url: "https://www.anrdoezrs.net/click-100274574-13899542",
		text: [
			"Hey there!",
			"Wanna record a full song?",
			"Right in your browser?",
			"Click right... HERE!"
		],
		weight: 3
	},

	{
		url: "https://forms.gle/E4ctbsMXk1n2U8dM9",
		text: [
			"Hey there!",
			"This is NV-1's creator, Nikolay - nice to meet you!",
			"Would you be interested in taking a course on Audio Processing & Synthesis in the Browser?",
			"CLICK HERE to let me know!"
		],
		weight: 1
	},

	{
		url: "https://forms.gle/7rr44vAqBrAKxUEU7",
		text: [
			"Hey there!",
			"Do you want to build your own synth?",
			"Click HERE to make an inquiry!"
		],
		weight: 1
	},

	{
		url: "https://forms.gle/Tnn2xfNtzjfPzGUM8",
		text: [
			"Hey there!",
			"Do you teach with NV-1?",
			"CLICK HERE to help me better understand how you use my synth!"
		],
		weight: 1
	}
];

function getAd () {

	var indexChance = [];

	ADS.forEach((value, index) => {

		indexChance = indexChance.concat ( Array.from( { length: Math.floor( value.weight * 10 ) } ).map( x => index ));
	});

	return ADS [
		indexChance[ Math.floor( Math.random() * indexChance.length ) ]
	];
}

module.exports = function( mod ) {

	mod.controller( "TypedAdController", [ "$scope", function ($scope) {

		var self = this,
			ad = getAd ();

		self.url = ad.url;

		$scope.options = {
			strings: ad.text,
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
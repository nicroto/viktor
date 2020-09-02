'use strict';


var GLOBALS = require( "globals" ),
	midiData = require( "./midi-data" ),
	selectedSong = midiData[
		Math.round (Math.random() * (midiData.length - 1))
	].tracks[ 0 ].notes,
	lastNote = -1,
	noteIndex = -1,
	songResetTimeout = null;


module.exports = function( mod ) {

	mod.controller( "EmailSubscriptionController", [ "$scope", function ($scope) {
		var self = this,
			subscribeUrl = "https://email.universless.com/subscribe",
			list = "DeZGWBgqRPb5C76CYbfSgQ";

		self.name = "";

		self.email = "";

		self.hp = "";

		self.subscribeSuccess = "false";

		self.status = "normal";

		self.tryToSubscribe = function () {
			var formData = [
				"name=" + encodeURIComponent (self.name),
				"email=" + encodeURIComponent (self.email),
				"list=" + encodeURIComponent (list),
				"hp=" + encodeURIComponent (self.hp),
				"api_key=" + encodeURIComponent (GLOBALS.EMAILLIST_API_KEY),
				"boolean=true",
			].join ("&");

			if ( self.status === "loading" )
			{
				// no need to start another subscribe api call
				return;
			}

			self.status = "loading";
			$.ajax( {
				type    :   "POST",
				url     :   subscribeUrl,
				data    :   formData,
				success :   function( data )
				{
					if ( data === "1" ) {
						self.subscribeSuccess = "true";
					} else {
						alert( data );
					}

					self.status = "normal";

					$scope.$apply ();
				}
			} );
		};
	} ] );

	mod.directive( "maillist", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "maillist.html" )
		};
	} ] );

	mod.directive( "melodicKeyboard", [ "$document", "$timeout", "dawEngine", function( $document, $timeout, dawEngine ) {

		return {
			restrict: "A",
			link: function( $scope, $element ) {

				var executeMidiMessage = function ( firstByte, secondByte, thirdByte ) {
					dawEngine.externalMidiMessage( {
						data: [
							firstByte,
							secondByte,
							thirdByte
						]
					} );
				};

				var noteOff = function () {
					if (lastNote !== -1) {
						executeMidiMessage(
							128,
							lastNote,
							100
						);

						lastNote = -1;
					}
				};

				$element.on( "keydown", function( eventObject ) {
					if ( $element.val () === "" ) {
						// if field is empty -> start over the song
						noteOff();
						noteIndex = -1;
					}

					// make sure not to switch patch
					if (
						eventObject.keyCode === 37 ||
						eventObject.keyCode === 39
					) {
						eventObject.stopPropagation ();
						return;
					}

					// trigger only on letters and nubers
					if ( eventObject.keyCode < 48 ) {
						return;
					}

					noteOff();

					noteIndex++;
					if ( noteIndex === selectedSong.length ) {
						noteIndex = 0;
					}

					lastNote = selectedSong[ noteIndex ].midi;

					eventObject.stopPropagation();

					executeMidiMessage(
						144,
						lastNote,
						100
					);

					if ( songResetTimeout ) {
						$timeout.cancel (songResetTimeout);
					}

					songResetTimeout = $timeout( function () {
						noteOff();
					}, 100 );
				} );

				$element.on( "keyup", function( eventObject ) {
					eventObject.stopPropagation();
				} );

			}
		};

	} ] );

};
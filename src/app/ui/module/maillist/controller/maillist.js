'use strict';

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

};
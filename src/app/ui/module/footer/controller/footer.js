'use strict';

module.exports = function( mod ) {

	mod.controller( "FooterCtrl", [ "$scope", "$modal", function( $scope, $modal ) {
		var self = this;

		self.openPrivacyPolicyModal = function() {
			$modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'privacyPolicyModal.html',
				controller: 'FooterModalCtrl',
				controllerAs: 'footerModal',
				size: null,
				resolve: null
			} );
		};

		self.openAboutModal = function() {
			$modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'aboutModal.html',
				controller: 'FooterModalCtrl',
				controllerAs: 'footerModal',
				size: null,
				resolve: null
			} );
		};
	} ] );

	mod.directive( "footerDirective", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "footer.html" )
		};
	} ] );

	mod.controller( "FooterModalCtrl", [ "$modalInstance", function( $modalInstance ) {
		var self = this;

		self.close = function() {
			$modalInstance.dismiss();
		};
	} ] );

};
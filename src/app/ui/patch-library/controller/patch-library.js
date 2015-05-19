'use strict';

module.exports = function( mod ) {

	mod.controller( "PatchLibraryCtrl", [ "$scope", "$modal", "dawEngine", "patchLibrary", function( $scope, $modal, dawEngine, patchLibrary ) {
		var self = this;

		self.selectedName = patchLibrary.getSelected().name;

		self.isSavePatchVisible = function() {
			return patchLibrary.unsavedPatch ? true : false;
		};

		self.openSavePatchModal = function() {
			var modalInstance = $modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'savePatchModal.html',
				controller: 'SavePatchModalCtrl',
				controllerAs: 'savePatchModal',
				size: null,
				resolve: null
			} );

			modalInstance.result.then( function( name ) {
				patchLibrary.saveCustom( name, patchLibrary.getSelected().patch );
			}, function() {} );
		};

		patchLibrary.onSelectionChange( function( selectedPatch ) {
			dawEngine.loadPatch( selectedPatch.patch );
		} );
	} ] );

	mod.controller( "SavePatchModalCtrl", [ "$modalInstance", "patchLibrary", function( $modalInstance, patchLibrary ) {
		var self = this;

		self.name = patchLibrary.getUniqueName();

		self.close = function() {
			$modalInstance.dismiss();
		};

		self.savePatch = function() {
			$modalInstance.close( self.name );
		};
	} ] );

	mod.directive( "patchLibrary", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "patch-library.html" )
		};
	} ] );

	mod.directive( "autofocus", function() {
		return {
			restrict: "A",
			link: function ( scope, element ) {
				element[0].focus();
			}
		};
	} );

};
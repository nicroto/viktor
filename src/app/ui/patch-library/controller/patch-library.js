'use strict';

module.exports = function( mod ) {

	mod.controller( "PatchLibraryCtrl", [ "$scope", "$modal", "dawEngine", "patchLibrary", function( $scope, $modal, dawEngine, patchLibrary ) {
		var self = this,
			selectedPatch = patchLibrary.getSelected();

		self.isSavePatchVisible = function() {
			return selectedPatch.isUnsaved ? true : false;
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

		self.isDeletePatchVisible = function() {
			return selectedPatch.isCustom ? true : false;
		};

		self.openDeletePatchModal = function() {
			var modalInstance = $modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'deletePatchModal.html',
				controller: 'DeletePatchModalCtrl',
				controllerAs: 'deletePatchModal',
				size: null,
				resolve: null
			} );

			modalInstance.result.then( function() {
				patchLibrary.removeCustom( selectedPatch.name );
			}, function() {} );
		};


		patchLibrary.onSelectionChange( function( newSelectedPatch ) {
			selectedPatch = newSelectedPatch;

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

	mod.controller( "DeletePatchModalCtrl", [ "$modalInstance", function( $modalInstance ) {
		var self = this;

		self.close = function() {
			$modalInstance.dismiss();
		};

		self.deletePatch = function() {
			$modalInstance.close();
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
'use strict';

var saveFile = require( "file-saver" ).saveAs;

module.exports = function( mod ) {

	mod.controller( "PatchLibraryCtrl", [ "$scope", "$modal", "dawEngine", "patchLibrary",
	function( $scope, $modal, dawEngine, patchLibrary ) {
		var self = this,
			selectedPatch = patchLibrary.getSelected(),
			customPatchNames = patchLibrary.getCustomNames();

		self.openSharePatchModal = function() {
			var modalInstance = $modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'sharePatchModal.html',
				controller: 'SharePatchModalCtrl',
				controllerAs: 'sharePatchModal',
				size: null,
				resolve: {
					selectedPatch: function() {
						return selectedPatch;
					}
				}
			} );

			modalInstance.result.then( function( name ) {
				patchLibrary.saveCustom( name, patchLibrary.getSelected().patch );
			}, function() {} );
		};

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
				templateUrl: 'confirmationModal.html',
				controller: 'ConfirmationModalCtrl',
				controllerAs: 'confirmationModal',
				size: null,
				resolve: {
					message: function() {
						return "Are you sure you want to delete this patch?";
					}
				}
			} );

			modalInstance.result.then( function() {
				patchLibrary.removeCustom( selectedPatch.name );
			}, function() {} );
		};

		self.openClearLibraryModal = function() {
			var modalInstance = $modal.open( {
				animation: $scope.animationsEnabled,
				templateUrl: 'confirmationModal.html',
				controller: 'ConfirmationModalCtrl',
				controllerAs: 'confirmationModal',
				size: null,
				resolve: {
					message: function() {
						return "This will reset your library to \"Factory\" and you will lose your custom patches. You can export it to back it up. Do you still want to do this?";
					}
				}
			} );

			modalInstance.result.then( function() {
				patchLibrary.overrideCustomLibrary( {} );
			}, function() {} );
		};

		self.import = function( files ) {
			if ( files.length ) {
				var reader = new FileReader();

				reader.onload = function() {
					var text = reader.result,
						customPatches;

					try {
						customPatches = JSON.parse( text );

						if ( customPatches ) {
							var modalInstance = $modal.open( {
								animation: $scope.animationsEnabled,
								templateUrl: 'confirmationModal.html',
								controller: 'ConfirmationModalCtrl',
								controllerAs: 'confirmationModal',
								size: null,
								resolve: {
									message: function() {
										return "This will completely replace your custom patch library (the defaults will remain untouched). You could export the library as a backup, first. Do you still want to do this?";
									}
								}
							} );

							modalInstance.result.then( function() {
								patchLibrary.overrideCustomLibrary( customPatches );
							}, function() {} );
						}
					} catch ( exception ) {
						console.log( "The file you try to import isn't a valid JSON." );
					}
				};

				reader.readAsText( files[ 0 ], "utf-8" );
			}
		};

		self.isExportVisible = function() {
			return customPatchNames.length > 0;
		};

		self.export = function() {
			var data = new Blob( [ JSON.stringify( patchLibrary.customPatches ) ], { type: "text/plain;charset=utf-8" } );

			saveFile( data, "viktor-custom-patches.json" );
		};

		patchLibrary.onSelectionChange( function( newSelectedPatch ) {
			selectedPatch = newSelectedPatch;
			customPatchNames = patchLibrary.getCustomNames();

			dawEngine.loadPatch( selectedPatch.patch );
		} );
	} ] );

	mod.controller( "SharePatchModalCtrl", [ "$modalInstance", "$window", "patchLibrary", "patchSharing", "selectedPatch", "googleApi",
	function( $modalInstance, $window, patchLibrary, patchSharing, selectedPatch, googleApi ) {
		var self = this,
			patchName = selectedPatch.name,
			tweetText = "I made a new sound with the Viktor NV-1 Synthesizer - " + patchName + ".",
			loc = $window.location,
			baseUrl = loc.origin + loc.pathname;

		self.urlToShare = null;

		self.isLoading = function() {
			return !self.urlToShare;
		};

		self.close = function() {
			$modalInstance.dismiss();
		};

		self.patchName = patchName;

		self.twitterUrl = null;

		patchSharing.getUrlToShare( selectedPatch, baseUrl, googleApi, function( url, largeUrl ) {
			self.twitterUrl = patchSharing.getTwitterUrl( tweetText, url );
			self.facebookUrl = patchSharing.getFacebookUrl( largeUrl, baseUrl );

			self.urlToShare = url;
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

	mod.controller( "ConfirmationModalCtrl", [ "$modalInstance", "message", function( $modalInstance, message ) {
		var self = this;

		self.message = message;

		self.dismiss = function() {
			$modalInstance.dismiss();
		};

		self.confirm = function() {
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
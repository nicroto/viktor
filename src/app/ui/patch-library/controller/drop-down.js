'use strict';

module.exports = function( mod ) {

	mod.controller( "DropDownCtrl", [ "$scope", "dawEngine", "patchLibrary", function( $scope, dawEngine, patchLibrary ) {
		var self = this,
			defaultPatches,
			customPatches,
			selectedName,
			pollSettings = function() {
				defaultPatches = patchLibrary.getDefaultNames();
				customPatches = patchLibrary.getCustomNames();
				selectedName = patchLibrary.getSelected().name;

				self.patches = [ { name: "Built-in", separator: "presentation" } ]
					.concat( defaultPatches.map( function( patchName, originalIndex ) {
						return { name: patchName, originalIndex: originalIndex };
					} ) )
					.concat( [ { name: "User's", separator: "presentation" } ] )
					.concat( customPatches.map( function( patchName, originalIndex ) {
						return { name: patchName, isCustom: true, originalIndex: originalIndex };
					} ) );
				self.selectedName = selectedName;
			},
			getSelectedIndex = function() {
				var patches = self.patches,
					index = -1;

				for ( var i = 0; i < patches.length; i++ ) {
					var patch = patches[ i ];

					if ( !patch.separator && patch.name === self.selectedName ) {
						index = i;
						break;
					}
				}

				return index;
			};

		pollSettings();

		self.selectPatch = function( patch ) {
			if ( !patch.separator ) {
				patchLibrary.selectPatch( patch.name );
			}
		};

		self.selectPrevious = function() {
			var selectedIndex = getSelectedIndex(),
				patchName = defaultPatches[ 0 ];

			if ( selectedIndex !== -1 ) {
				var patches = self.patches,
					patch = patches[ selectedIndex ],
					isCustom = patch.isCustom,
					array = isCustom ? customPatches : defaultPatches,
					newIndex = patch.originalIndex - 1;

				if ( isCustom ) {
					patchName = newIndex < 0 ? defaultPatches[ defaultPatches.length - 1 ] : array[ newIndex ];
				} else {
					var fallbackArray = ( customPatches.length > 0 ) ? customPatches : defaultPatches;
					patchName = newIndex < 0 ? fallbackArray[ fallbackArray.length - 1 ] : array[ newIndex ];
				}
			}

			patchLibrary.selectPatch( patchName );
		};

		self.selectNext = function() {
			var selectedIndex = getSelectedIndex(),
				patchName = defaultPatches[ 0 ];

			if ( selectedIndex !== -1 ) {
				var patches = self.patches,
					patch = patches[ selectedIndex ],
					isCustom = patch.isCustom,
					array = isCustom ? customPatches : defaultPatches,
					newIndex = patch.originalIndex + 1;

				if ( isCustom ) {
					patchName = newIndex === array.length ? defaultPatches[ 0 ] : array[ newIndex ];
				} else {
					var fallbackArray = ( customPatches.length > 0 ) ? customPatches : defaultPatches;
					patchName = newIndex === array.length ? fallbackArray[ 0 ] : array[ newIndex ];
				}
			}

			patchLibrary.selectPatch( patchName );
		};

		patchLibrary.onSelectionChange( function( selectedPatch ) {
			pollSettings();
			dawEngine.loadPatch( selectedPatch.patch );
		} );

	} ] );

	mod.directive( "dropDown", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "drop-down.html" )
		};
	} ] );

};
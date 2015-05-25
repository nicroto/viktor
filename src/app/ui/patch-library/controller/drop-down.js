'use strict';

module.exports = function( mod ) {

	mod.controller( "DropDownCtrl", [ "dawEngine", "patchLibrary", function( dawEngine, patchLibrary ) {
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
			};

		pollSettings();

		self.getSelectedName = function() {
			var name = self.selectedName;

			if ( name.length > 28 ) {
				return name.substr( 0, 24 ) + "...";
			} else {
				return name;
			}
		};

		self.selectPatch = function( patch ) {
			if ( !patch.separator ) {
				patchLibrary.selectPatch( patch.name );
			}
		};

		self.selectPrevious = function() {
			var previousName = patchLibrary.getPreviousName( selectedName );

			patchLibrary.selectPatch( previousName ? previousName : defaultPatches[ 0 ] );
		};

		self.selectNext = function() {
			var nextName = patchLibrary.getNextName( selectedName );

			patchLibrary.selectPatch( nextName ? nextName : defaultPatches[ 0 ] );
		};

		patchLibrary.onSelectionChange( function() {
			pollSettings();
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
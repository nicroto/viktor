'use strict';

var UNSAVED_NAME = "Custom Unsaved";

function Library( name, defaultPatches, store ) {
	var self = this;

	self.store = store;

	self.SELECTED = name + "_selected";
	self.CUSTOM = name + "_custom";
	self.UNSAVED = name + "_unsaved";

	var customPatches = store.get( self.CUSTOM ),
		unsavedPatch = store.get( self.UNSAVED ),
		selectedName = store.get( self.SELECTED );

	self.defaultPatches = defaultPatches || {};
	self.customPatches = customPatches ? JSON.parse( customPatches ) : {};
	self.unsavedPatch = unsavedPatch ? JSON.parse( unsavedPatch) : null;
	self.selectedName = selectedName;

	self._selectionChangeHandlers = [];
}

Library.prototype = {

	getSelected: function() {
		var self = this,
			defaultPatches = self.defaultPatches,
			customPatches = self.customPatches,
			unsavedPatch = self.unsavedPatch,
			selectedName = self.selectedName,
			result = null;

		if ( unsavedPatch ) {
			result = {
				name: UNSAVED_NAME,
				patch: unsavedPatch,
				isUnsaved: true
			};
		} else if ( selectedName ) {
			var isCustom = customPatches[ selectedName ] ? true : false;
			result = {
				name: selectedName,
				patch: isCustom ? customPatches[ selectedName ] : defaultPatches[ selectedName ],
				isCustom: isCustom
			};
		} else {
			var defaultNames = Object.keys( defaultPatches ),
				personalNames = Object.keys( customPatches ),
				name;

			if ( defaultNames.length ) {
				name = defaultNames[ 0 ];

				result = {
					name: name,
					patch: defaultPatches[ name ]
				};
			} else if ( customPatches.length ) {
				name = personalNames[ 0 ];

				result = {
					name: name,
					patch: customPatches[ name ],
					isCustom: true
				};
			}
		}

		return result;
	},

	preserveUnsaved: function( patch ) {
		var self = this,
			store = self.store,
			isSelectionChanging = self.selectedName || !self.unsavedPatch || false;

		store.remove( self.SELECTED );
		self.selectedName = null;

		store.set( self.UNSAVED, JSON.stringify( patch ) );
		self.unsavedPatch = patch;

		if ( isSelectionChanging ) {
			self._announceSelectionChange();
		}
	},

	getDefaultNames: function() {
		var self = this,
			defaultPatches = self.defaultPatches;

		return Object.keys( defaultPatches );
	},

	getCustomNames: function() {
		var self = this,
			customPatches = self.customPatches;

		return Object.keys( customPatches );
	},

	_announceSelectionChange: function() {
		var self = this,
			selectedPatch = self.getSelected();

		self._selectionChangeHandlers.forEach( function( handler ) {
			handler( selectedPatch );
		} );
	},

	selectPatch: function( patchName ) {
		var self = this,
			store = self.store;

		self.unsavedPatch = null;
		store.remove( self.UNSAVED );

		self.selectedName = patchName;
		store.set( self.SELECTED, patchName );

		self._announceSelectionChange();
	},

	onSelectionChange: function( handler ) {
		var self = this;

		self._selectionChangeHandlers.push( handler );
	},

	getUniqueName: function() {
		var self = this,
			names = self.getDefaultNames().concat( self.getCustomNames() ),
			count = 0,
			result;

		while( !result && count < 1000 ) {
			var name = UNSAVED_NAME + ( ++count );
			if ( names.indexOf( name ) === -1 ) {
				result = name;
				break;
			}
		}

		return result;
	},

	saveCustom: function( patchName, patch ) {
		var self = this,
			customPatches = self.customPatches,
			store = self.store;

		self.unsavedPatch = null;
		store.remove( self.UNSAVED );

		self.selectedName = patchName;
		store.set( self.SELECTED, patchName );

		customPatches[ patchName ] = patch;
		store.set( self.CUSTOM, JSON.stringify( customPatches ) );

		self._announceSelectionChange();
	},

	getPreviousName: function( patchName ) {
		var self = this,
			names = self.getDefaultNames().concat( self.getCustomNames() ),
			index = names.indexOf( patchName ),
			result;

		if ( index !== -1 ) {
			result = ( index > 0 ) ? names[ --index ] : names[ names.length - 1 ];
		}

		return result;
	},

	getNextName: function( patchName ) {
		var self = this,
			names = self.getDefaultNames().concat( self.getCustomNames() ),
			index = names.indexOf( patchName ),
			result;

		if ( index !== -1 ) {
			result = ( index < ( names.length - 1 ) ) ? names[ ++index ] : names[ 0 ];
		}

		return result;
	},

	removeCustom: function( patchName ) {
		var self = this,
			customPatches = self.customPatches,
			store = self.store;

		if ( !customPatches[ patchName ] ) {
			return;
		}

		var previousPatchName = self.getPreviousName( patchName );

		self.unsavedPatch = null;
		store.remove( self.UNSAVED );

		self.selectedName = previousPatchName;
		if ( previousPatchName ) {
			store.set( self.SELECTED, previousPatchName );
		} else {
			store.remove( self.SELECTED );
		}

		delete customPatches[ patchName ];
		store.set( self.CUSTOM, JSON.stringify( customPatches ) );

		self._announceSelectionChange();
	},

	overrideCustomLibrary: function( customPatches ) {
		var self = this,
			store = self.store,
			selectedPatch = self.getSelected();

		if ( selectedPatch.isCustom && !customPatches[ selectedPatch.name ] ) {
			store.remove( self.SELECTED );
			self.selectedName = null;

			self.preserveUnsaved( selectedPatch.patch );
		}

		self.customPatches = customPatches;
		store.set( self.CUSTOM, JSON.stringify( customPatches ) );

		self._announceSelectionChange();
	}

};

module.exports = Library;
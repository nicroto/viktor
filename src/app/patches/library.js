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
				patch: unsavedPatch
			};
		} else if ( selectedName ) {
			result = {
				name: selectedName,
				patch: defaultPatches[ selectedName ] || customPatches[ selectedName ]
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
					patch: customPatches[ name ]
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
	}

};

module.exports = Library;
'use strict';

function Library( name, defaultPatches, store ) {
	var self = this;

	self.store = store;

	self.SELECTED = name + "_selected";
	self.PERSONAL = name + "_personal";
	self.UNSAVED = name + "_unsaved";

	var personalPatches = store.get( self.PERSONAL ),
		unsavedPatch = store.get( self.UNSAVED ),
		selectedName = store.get( self.SELECTED );

	self.defaultPatches = defaultPatches || {};
	self.personalPatches = personalPatches ? JSON.parse( personalPatches ) : {};
	self.unsavedPatch = unsavedPatch ? JSON.parse( unsavedPatch) : null;
	self.selectedName = selectedName;
}

Library.prototype = {

	getSelected: function() {
		var self = this,
			defaultPatches = self.defaultPatches,
			personalPatches = self.personalPatches,
			unsavedPatch = self.unsavedPatch,
			selectedName = self.selectedName,
			result = null;

		if ( unsavedPatch ) {
			result = unsavedPatch;
		} else if ( selectedName ) {
			result = defaultPatches[ selectedName ] || personalPatches[ selectedName ];
		} else {
			var defaultNames = Object.keys( defaultPatches ),
				personalNames = Object.keys( personalPatches );

			if ( defaultNames.length ) {
				result = defaultPatches[ defaultNames[ 0 ] ];
			} else if ( personalPatches.length ) {
				result = personalPatches[ personalNames[ 0 ] ];
			}
		}

		return result;
	},

	preserveUnsaved: function( patch ) {
		var self = this,
			store = self.store;

		store.remove( self.SELECTED );
		self.selectedName = null;

		store.set( self.UNSAVED, JSON.stringify( patch ) );
		self.unsavedPatch = patch;
	}

};

module.exports = Library;
'use strict';

var queryStringUtils = require( "querystring" ),
	deepEqual = require( "deep-equal" );

var patchSharing = {

	resolvePatchSelection: function( queryString, patchLibrary ) {
		var self = this,
			names = patchLibrary.getDefaultNames().concat( patchLibrary.getCustomNames() ),
			params = self._parseQueryString( queryString ),
			name = params.name,
			patch = params.patch;

		if ( name && patch ) {

			if ( names.indexOf( name ) !== -1 ) {
				var oldPatch = patchLibrary.getPatch( name );

				if ( oldPatch.isCustom && !deepEqual( oldPatch.patch, patch ) ) {
					name = patchLibrary.getUniqueName( name );

					patchLibrary.saveCustom( name, patch );
				} else {
					patchLibrary.selectPatch( name );
				}
			} else {
				patchLibrary.saveCustom( name, patch );
			}

		} else if ( name ) {

			if ( names.indexOf( name ) !== -1 ) {
				patchLibrary.selectPatch( name );
			}

		}
	},

	_parseQueryString: function( queryString ) {
		var params = queryStringUtils.parse( queryString ),
			patch = params.patch;

		if ( patch ) {
			try {
				params.patch = JSON.parse( ( new Buffer( patch, "base64" ) ).toString() );
			} catch( error ) {
				delete params.patch;
				console.log( error );
			}
		}

		return params;
	},



};

module.exports = patchSharing;
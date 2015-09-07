'use strict';

var queryStringUtils = require( "querystring" ),
	deepEqual = require( "deep-equal" ),
	GLOBALS = require( "./globals" );

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

	shortenUrl: function( url, googleApi, callback ) {
		if ( googleApi.loaded ) {
			var request = googleApi.api.client.urlshortener.url.insert( {
				"longUrl": url
			} );

			request.then( function( response ) {
				callback( response.result.id );
			}, function( reason ) {
				console.error( "Error shortening url through Google's API: " + reason.result.error.message );
				// on API error go with the default
				callback( url );
			} );
		} else {
			console.warn( "Google API not loaded, yet." );
			// if API not loaded go with the default
			callback( url );
		}
	},

	getUrlToShare: function( patch, baseUrl, googleApi, callback ) {
		var self = this,
			QUERY_STRING = "{{queryString}}",
			urlTemplate = baseUrl + "?" + QUERY_STRING,
			name = patch.name;

		if ( patch.isCustom || patch.isUnsaved ) {
			var queryString = queryStringUtils.stringify( {
					name: name,
					patch: ( new Buffer( JSON.stringify( patch.patch ) ).toString( "base64" ) )
				} ),
				urlToShorten = urlTemplate.replace( QUERY_STRING, queryString );

			self.shortenUrl( urlToShorten, googleApi, function( shortUrl ) {
				callback( shortUrl, urlToShorten );
			} );
		} else {
			var queryString = queryStringUtils.stringify( { name: name } ),
				url = urlTemplate.replace( QUERY_STRING, queryString );

			callback( url, url );
		}
	},

	getTwitterUrl: function( tweetText, url ) {
		var baseUrl = "https://twitter.com/intent/tweet",
			queryString = queryStringUtils.stringify( { text: tweetText, url: url } );

		return baseUrl + "?" + queryString;
	},

	getFacebookUrl: function( url, redirectUrl ) {
		return [
			"https://www.facebook.com/dialog/share?app_id=" + GLOBALS.FACEBOOK_APP_ID,
				"display=popup",
				"href={{href}}",
				"redirect_uri={{redirectUrl}}"
		].join( "&" )
			.replace( "{{href}}", encodeURIComponent( url ) )
			.replace( "{{redirectUrl}}", encodeURIComponent( redirectUrl ) );
	}

};

module.exports = patchSharing;
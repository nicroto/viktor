/* jshint -W030 */

'use strict';

var should = require( "should" ),
	queryStringUtils = require( "querystring" ),
	GLOBALS = require( "../non-npm/viktor/globals" ),
	patchSharing = require( "../non-npm/viktor/patch-sharing" ),
	PatchLibrary = require( "viktor-nv1-engine" ).PatchLibrary,
	data = require( "./data/patch-sharing" );

var mockStore = {

		data: {},

		get: function( key ) {
			var self = this;

			return self.data[ key ];
		},

		set: function( key, value ) {
			var self = this;

			self.data[ key ] = value;
		},

		remove: function( key ) {
			var self = this;

			delete self.data[ key ];
		},

		clear: function() {
			var self = this;

			self.data = {};
		}

	},
	patchLibrary,
	label = "VIKTOR_SYNTH",
	customLibraryKey = label + "_custom",
	selectedPatchKey = label + "_selected",
	customPatchName = "Custom Patch";

describe( "patchSharing", function() {

	describe( "resolvePatchSelection( queryString, patchLibrary )", function() {

		it( "doesn't select a patch if no params in the queryString", function() {
			mockStore.clear();
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchSharing.resolvePatchSelection( "", patchLibrary );

			should.not.exist( mockStore.get( selectedPatchKey ) );
		} );

		it( "doesn't select a patch if no name in the queryString", function() {
			mockStore.clear();
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchSharing.resolvePatchSelection(
				queryStringUtils.stringify( {
					patch: ( new Buffer( JSON.stringify( data.customLibrary[ customPatchName ] ) ).toString( "base64" ) )
				} ),
				patchLibrary
			);

			should.not.exist( mockStore.get( selectedPatchKey ) );
		} );

		it( "selects a patch if only name is passed", function( done ) {
			mockStore.clear();
			mockStore.set( customLibraryKey, JSON.stringify( data.customLibrary ) );
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchLibrary.onSelectionChange( function( selectedPatch ) {
				selectedPatch.name.should.equal( customPatchName );

				done();
			} );

			patchSharing.resolvePatchSelection( queryStringUtils.stringify( { name: customPatchName } ), patchLibrary );
		} );

		it( "doesn't select a patch if only name is passed and patch doesn't exist", function() {
			mockStore.clear();
			patchLibrary = new PatchLibrary( label, {}, mockStore );

			patchSharing.resolvePatchSelection( queryStringUtils.stringify( { name: "Non existent patch" } ), patchLibrary );

			should.not.exist( mockStore.get( selectedPatchKey ) );
		} );

		it( "creates a custom patch if name and patch is passed", function( done ) {
			var passedPatchName = "My awesome patch";
			mockStore.clear();
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchLibrary.onSelectionChange( function( selectedPatch ) {
				selectedPatch.name.should.equal( passedPatchName );
				selectedPatch.patch.should.eql( data.customLibrary[ customPatchName ] );
				selectedPatch.isCustom.should.be.ok;
				done();
			} );

			patchSharing.resolvePatchSelection(
				queryStringUtils.stringify( {
					name: passedPatchName,
					patch: ( new Buffer( JSON.stringify( data.customLibrary[ customPatchName ] ) ).toString( "base64" ) )
				} ),
				patchLibrary
			);
		} );

		it( "creates a custom patch even if name already exists, but patch is different", function( done ) {
			var passedPatchName = "Custom Patch";
			mockStore.clear();
			mockStore.set( customLibraryKey, JSON.stringify( data.customLibrary ) );
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchLibrary.onSelectionChange( function( selectedPatch ) {
				selectedPatch.name.should.equal( passedPatchName + "1" );
				selectedPatch.patch.should.eql( {} );
				selectedPatch.isCustom.should.be.ok;
				done();
			} );

			patchSharing.resolvePatchSelection(
				queryStringUtils.stringify( {
					name: passedPatchName,
					patch: ( new Buffer( JSON.stringify( {} ) ).toString( "base64" ) )
				} ),
				patchLibrary
			);
		} );

		it( "doesn't create the same patch over and over again", function( done ) {
			var passedPatchName = "My awesome patch";
			mockStore.clear();
			patchLibrary = new PatchLibrary( label, data.defaultLibrary, mockStore );

			patchSharing.resolvePatchSelection(
				queryStringUtils.stringify( {
					name: passedPatchName,
					patch: ( new Buffer( JSON.stringify( data.customLibrary[ customPatchName ] ) ).toString( "base64" ) )
				} ),
				patchLibrary
			);

			patchLibrary.onSelectionChange( function( selectedPatch ) {
				// the name stayed the same, which means no duplication of patch
				selectedPatch.name.should.equal( passedPatchName );

				done();
			} );

			patchSharing.resolvePatchSelection(
				queryStringUtils.stringify( {
					name: passedPatchName,
					patch: ( new Buffer( JSON.stringify( data.customLibrary[ customPatchName ] ) ).toString( "base64" ) )
				} ),
				patchLibrary
			);
		} );

	} );

	describe( "getTwitterUrl( tweetText, url )", function() {

		it( "generates a correct twitter web intent url", function() {
			var url = encodeURIComponent( "http://example.com/?name=test&patch=askjfffnajksg==" ),
				text = "text",
				queryString = queryStringUtils.stringify( { text: text, url: url } );

			patchSharing.getTwitterUrl( text, url ).should.equal( "https://twitter.com/intent/tweet?" + queryString );
		} );

	} );

	describe( "getFacebookUrl( url, redirectUrl )", function() {

		it( "generates a correct facebook share url", function() {
			var url = "http://example.com/?name=test&patch=askjfffnajksg==",
				redirectUrl = "http://example.com/?name=test&patch=askjfffnajksg==",
				queryString = queryStringUtils.stringify( {
					app_id: GLOBALS.FACEBOOK_APP_ID,
					display: "popup",
					href: url,
					redirect_uri: redirectUrl
				} );

			patchSharing.getFacebookUrl( url, redirectUrl ).should.equal( "https://www.facebook.com/dialog/share?" + queryString );
		} );

	} );

	describe( "shortenUrl( url, googleApi, callback )", function() {

		it( "returns the initial url if the googleApi hasn't loaded, yet", function( done ) {
			var url = "http://example.com/",
				mockGoogleApi = {
					loaded: false
				};

			patchSharing.shortenUrl( url, mockGoogleApi, function( newUrl ) {
				newUrl.should.equal( url );
				done();
			} );
		} );

		it( "returns the initial url if googleApi responds with error", function( done ) {
			var url = "http://example.com/",
				mockGoogleApi = {
					loaded: true,
					api: {
						client: {
							urlshortener: {
								url: {
									insert: function() {
										return {
											then: function( successCallback, errorCallback ) {
												errorCallback( { result: { error: { message: "ver bad error, good luck!" } } } );
											}
										};
									}
								}
							}
						}
					}
				};

			patchSharing.shortenUrl( url, mockGoogleApi, function( newUrl ) {
				newUrl.should.equal( url );
				done();
			} );
		} );

		it( "returns the shortened url", function( done ) {
			var url = "http://example.com/",
				shortUrl = "http://e.c",
				mockGoogleApi = {
					loaded: true,
					api: {
						client: {
							urlshortener: {
								url: {
									insert: function() {
										return {
											then: function( successCallback ) {
												successCallback( { result: { id: shortUrl } } );
											}
										};
									}
								}
							}
						}
					}
				};

			patchSharing.shortenUrl( url, mockGoogleApi, function( newUrl ) {
				newUrl.should.equal( shortUrl );
				done();
			} );
		} );

	} );

	describe( "getUrlToShare( patch, baseUrl, googleApi, callback )", function() {

		var originalShortenUrl,
			shortUrl = "http://e.c";

		before( function() {
			originalShortenUrl = patchSharing.shortenUrl;
			patchSharing.shortenUrl = function( url, googleApi, callback ) {
				callback( shortUrl );
			};
		} );


		it( "returns a shortened url if patch is custom", function( done ) {
			var baseUrl = "http://example.com/",
				patch = {
					name: "Patch Name",
					patch: {},
					isCustom: true
				},
				mockGoogleApi = {},
				expectedLongUrl = baseUrl + "?" + queryStringUtils.stringify( {
					name: patch.name,
					patch: ( new Buffer( JSON.stringify( patch.patch ) ).toString( "base64" ) )
				} );

			patchSharing.getUrlToShare( patch, baseUrl, mockGoogleApi, function( shortenedUrl, longUrl ) {
				shortenedUrl.should.equal( shortUrl );
				longUrl.should.equal( expectedLongUrl );
				done();
			} );
		} );

		it( "returns a shortened url if patch is unsaved", function( done ) {
			var baseUrl = "http://example.com/",
				patch = {
					name: "Patch Name",
					patch: {},
					isUnsaved: true
				},
				mockGoogleApi = {},
				expectedLongUrl = baseUrl + "?" + queryStringUtils.stringify( {
					name: patch.name,
					patch: ( new Buffer( JSON.stringify( patch.patch ) ).toString( "base64" ) )
				} );

			patchSharing.getUrlToShare( patch, baseUrl, mockGoogleApi, function( shortenedUrl, longUrl ) {
				shortenedUrl.should.equal( shortUrl );
				longUrl.should.equal( expectedLongUrl );
				done();
			} );
		} );

		it( "returns only long url if patch is from default library", function( done ) {
			var baseUrl = "http://example.com/",
				patch = {
					name: "Patch Name",
					patch: {}
				},
				mockGoogleApi = {};

			patchSharing.getUrlToShare( patch, baseUrl, mockGoogleApi, function( shortenedUrl, longUrl ) {
				shortenedUrl.should.not.equal( shortUrl );
				shortenedUrl.should.equal( longUrl );
				done();
			} );
		} );

		it( "returns url without patch queryString param, if patch is from default library", function( done ) {
			var baseUrl = "http://example.com/",
				patch = {
					name: "Patch Name",
					patch: {}
				},
				mockGoogleApi = {},
				expectedLongUrl = baseUrl + "?" + queryStringUtils.stringify( {
					name: patch.name
				} );

			patchSharing.getUrlToShare( patch, baseUrl, mockGoogleApi, function( shortenedUrl, longUrl ) {
				longUrl.should.equal( expectedLongUrl );
				done();
			} );
		} );


		after( function() {
			patchSharing.shortenUrl = originalShortenUrl;
		} );

	} );

} );
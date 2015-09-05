/* jshint -W030 */

'use strict';

var should = require( "should" ),
	queryStringUtils = require( "querystring" ),
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

} );
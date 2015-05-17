/* jshint -W098 */

'use strict';

var should = require( "should" ),
	settingsConvertor = require( "../non-npm/viktor/settings-convertor" );

describe( "settings convertor", function() {

	describe( "transposeValue( value, originalRange, newRange )", function() {

		it( "transposes in [ 0, 1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeValue(
				64,
				[ 0, 128 ],
				[ 0, 1 ]
			).should.equal( 0.5 );
		} );

		it( "transposes in [ -1, 1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeValue(
				64,
				[ 0, 128 ],
				[ -1, 1 ]
			).should.equal( 0 );
		} );

		it( "transposes in [ -3, -1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeValue(
				64,
				[ 0, 128 ],
				[ -3, -1 ]
			).should.equal( -2 );
		} );

		it( "transposes in [ 0, 128 ] from [ 0, 1 ]", function() {
			settingsConvertor.transposeValue(
				0.5,
				[ 0, 1 ],
				[ 0, 128 ]
			).should.equal( 64 );
		} );

		it( "transposes in [ 0, 128 ] from [ -1, 1 ]", function() {
			settingsConvertor.transposeValue(
				0,
				[ -1, 1 ],
				[ 0, 128 ]
			).should.equal( 64 );
		} );

		it( "transposes in [ 0, 128 ] from [ -3, -1 ]", function() {
			settingsConvertor.transposeValue(
				-2,
				[ -3, -1 ],
				[ 0, 128 ]
			).should.equal( 64 );
		} );

		it( "transposes in [ -4, 2 ] from [ 0, 6 ]", function() {
			settingsConvertor.transposeValue(
				1,
				[ 0, 6 ],
				[ -4, 2 ]
			).should.equal( -3 );
		} );

		it( "transposes in [ -8, 8 ] from [ 0, 16 ]", function() {
			settingsConvertor.transposeValue(
				8,
				[ 0, 16 ],
				[ -8, 8 ]
			).should.equal( 0 );
		} );

		it( "transposes in [ 0.001, 1 ] from [ 0, 100 ]", function() {
			settingsConvertor.transposeValue(
				0,
				[ 0, 100 ],
				[ 0.001, 1 ]
			).should.equal( 0.001 );
		} );

	} );

	describe( "transposeParam( param, newRange )", function() {

		it( "transposes param in [ 0, 1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 64, range: [ 0, 128 ] },
				[ 0, 1 ]
			).should.eql( { value: 0.5, range: [ 0, 1 ] } );
		} );

		it( "transposes param in [ -1, 1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 64, range: [ 0, 128 ] },
				[ -1, 1 ]
			).should.eql( { value: 0, range: [ -1, 1 ] } );
		} );

		it( "transposes param in [ -3, -1 ] from [ 0, 128 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 64, range: [ 0, 128 ] },
				[ -3, -1 ]
			).should.eql( { value: -2, range: [ -3, -1 ] } );
		} );

		it( "transposes param in [ 0, 128 ] from [ 0, 1 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 0.5, range: [ 0, 1 ] },
				[ 0, 128 ]
			).should.eql( { value: 64, range: [ 0, 128 ] } );
		} );

		it( "transposes param in [ 0, 128 ] from [ -1, 1 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 0, range: [ -1, 1 ] },
				[ 0, 128 ]
			).should.eql( { value: 64, range: [ 0, 128 ] } );
		} );

		it( "transposes param in [ 0, 128 ] from [ -3, -1 ]", function() {
			settingsConvertor.transposeParam(
				{ value: -2, range: [ -3, -1 ] },
				[ 0, 128 ]
			).should.eql( { value: 64, range: [ 0, 128 ] } );
		} );

		it( "transposes param in [ -4, 2 ] from [ 0, 6 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 1, range: [ 0, 6 ] },
				[ -4, 2 ]
			).should.eql( { value: -3, range: [ -4, 2 ] } );
		} );

		it( "transposes param in [ -8, 8 ] from [ 0, 16 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 8, range: [ 0, 16 ] },
				[ -8, 8 ]
			).should.eql( { value: 0, range: [ -8, 8 ] } );
		} );

		it( "transposes param in [ 0.001, 1 ] from [ 0, 100 ]", function() {
			settingsConvertor.transposeParam(
				{ value: 0, range: [ 0, 100 ] },
				[ 0.001, 1 ]
			).should.eql( { value: 0.001, range: [ 0.001, 1 ] } );
		} );

	} );

	describe( "getRangeCenter( range )", function() {

		it( "gets the center of [ 0, 1 ]", function() {
			settingsConvertor.getRangeCenter( [ 0, 1 ] ).should.equal( 0.5 );
		} );

		it( "gets the center of [ 0, 128 ]", function() {
			settingsConvertor.getRangeCenter( [ 0, 128 ] ).should.equal( 64 );
		} );

		it( "gets the center of [ 0, 3 ]", function() {
			settingsConvertor.getRangeCenter( [ 0, 3 ] ).should.equal( 1.5 );
		} );

		it( "gets the center of [ -5, 5 ]", function() {
			settingsConvertor.getRangeCenter( [ -5, 5 ] ).should.equal( 0 );
		} );

	} );

} );
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

	} );

} );
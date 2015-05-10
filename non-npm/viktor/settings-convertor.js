'use strict';

var SIMPLE_PITCH_HALF_RANGE = 64;

module.exports = {

	getSimplePitch: function( value ) {
		return Math.floor( value * SIMPLE_PITCH_HALF_RANGE + SIMPLE_PITCH_HALF_RANGE );
	},

	getNormalPitch: function( value ) {
		return ( value - SIMPLE_PITCH_HALF_RANGE ) / SIMPLE_PITCH_HALF_RANGE;
	},

	getRateFromModulation: function( modulation ) {
		return 15 * modulation;
	},

	getSimpleModulationFromRate: function( value ) {
		return Math.round( ( value / 15 ) * 127 );
	},

	getRateFromSimpleModulation: function( value ) {
		var self = this;

		return self.getRateFromModulation( value / 127 );
	}

};
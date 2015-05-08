'use strict';

module.exports = {

	getGain: function( value ) {
		return value / 100;
	},

	getReverbDryLevel: function( value ) {
		return 1 - ( value / 2 );
	},

	getTime: function( value ) {
		return value * 10;
	},

	_getValueBetweenZeroAndOne: function( value ) {
		return value / 100;
	},

	getFeedback: function( value ) {
		var self = this;
		return self._getValueBetweenZeroAndOne( value );
	},

	getDryLevel: function( value ) {
		var self = this;
		return self._getValueBetweenZeroAndOne( value );
	},

	getWetLevel: function( value ) {
		var self = this;
		return self._getValueBetweenZeroAndOne( value );
	}

};
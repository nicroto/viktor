'use strict';

var SEMITONE_CENTS = 100,
	OCTAVE_CENTS = 12 * SEMITONE_CENTS,
	FINE_DETUNE_HALF_SPECTRE = 8,
	RANGE_DEFAULT_BASE = 3;


var utils = {

	OSC_WAVEFORM: [
		"sine",
		"square",
		"sawtooth",
		"triangle"
	],
	OSC3_RANGE_BASE: 4,

	getDetune: function( range, fineDetune, rangeBase ) {
		rangeBase = rangeBase === undefined ? RANGE_DEFAULT_BASE : rangeBase;
		var base = ( range - rangeBase ) * OCTAVE_CENTS;
		// if no fineDetune, then fineDetune === FINE_DETUNE_HALF_SPECTRE => fine === 0
		var fine = ( fineDetune - FINE_DETUNE_HALF_SPECTRE ) * SEMITONE_CENTS;

		return base + fine;
	}

};

module.exports = utils;
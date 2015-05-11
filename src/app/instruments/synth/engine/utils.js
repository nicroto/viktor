'use strict';

var SEMITONE_CENTS = 100,
	OCTAVE_CENTS = 12 * SEMITONE_CENTS,
	FINE_DETUNE_HALF_SPECTRE = 8,
	RANGE_DEFAULT_BASE = 3;

var utils = {

	customOrDefault: function( customValue, defaultValue ) {
		return customValue !== undefined ? customValue : defaultValue;
	},

	getDetune: function( range, fineDetune, rangeBase ) {
		rangeBase = rangeBase === undefined ? RANGE_DEFAULT_BASE : rangeBase;
		var base = ( range - rangeBase ) * OCTAVE_CENTS;
		// if no fineDetune, then fineDetune === FINE_DETUNE_HALF_SPECTRE => fine === 0
		var fine = ( fineDetune - FINE_DETUNE_HALF_SPECTRE ) * SEMITONE_CENTS;

		return base + fine;
	},

	getVolume: function( value ) {
		return value / 100;
	},

	getNoiseGenerator: function( type, bufferSize ) {
		// code copied from here:
		//		http://noisehack.com/generate-noise-web-audio-api/
		var self = this,
			generator;
		switch ( type ) {
			case "white":
				generator = function( e ) {
					var output = e.outputBuffer.getChannelData( 0 );
					for ( var i = 0; i < bufferSize; i++ ) {
						output[ i ] = Math.random() * 2 - 1;
					}
				};
				break;
			case "pink":
				generator = ( function() {
					var b0, b1, b2, b3, b4, b5, b6;
					b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
					var result = function( e ) {
						var output = e.outputBuffer.getChannelData( 0 );
						for ( var i = 0; i < bufferSize; i++ ) {
							var white = Math.random() * 2 - 1;

							b0 = 0.99886 * b0 + white * 0.0555179;
							b1 = 0.99332 * b1 + white * 0.0750759;
							b2 = 0.96900 * b2 + white * 0.1538520;
							b3 = 0.86650 * b3 + white * 0.3104856;
							b4 = 0.55000 * b4 + white * 0.5329522;
							b5 = -0.7616 * b5 - white * 0.0168980;

							output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
							output[i] *= 0.11; // (roughly) compensate for gain

							b6 = white * 0.115926;
						}
					};
					return result;
				} )();
				break;
			case "brown":
				generator = ( function() {
					var lastOut = 0.0;
					var result = function( e ) {
						var output = e.outputBuffer.getChannelData( 0 );
						for ( var i = 0; i < bufferSize; i++ ) {
							var white = Math.random() * 2 - 1;
							output[ i ] = ( lastOut + ( 0.02 * white ) ) / 1.02;
							lastOut = output[ i ];
							output[ i ] *= 3.5; // (roughly) compensate for gain
						}
					};
					return result;
				} )();
				break;
		}

		return generator;
	},

	getPortamento: function( value ) {
		var self = this;

		return self.getVolume( value ) / 6;
	},

	getAttack: function( value ) {
		var self = this;

		return self._getTwoSecTiming( value );
	},

	getDecay: function( value ) {
		var self = this;

		return self._getTwoSecTiming( value );
	},

	getSustain: function( value ) {
		var self = this;

		// the volume level in +%
		return Math.max( value / 100, 0 );
	},

	getRelease: function( value ) {
		var self = this;

		return self._getTwoSecTiming( value );
	},

	_getTwoSecTiming: function( value ) {
		// assumes 0 <= value <= 100
		return ( value > 0 ) ?
			2 * value / 100
		:
			0;
	},

	getCutoff: function( upperBound, value ) {
		return upperBound * value / 500;
	},

	getEmphasis: function( value ) {
		return 40 * value / 100;
	},

	getGain: function( value ) {
		return value / 100;
	},

	getCustomWaveForm: function( waveformFFT ) {
		var fft = waveformFFT.fft,
			size = fft.real.length,
			real = new Float32Array( size ),
			imag = new Float32Array( size );

		for ( var i = 0; i < size; i++ ) {
			real[ i ] = fft.real[ i ];
			imag[ i ] = fft.imag[ i ];
		}

		return {
			real: real,
			imag: imag
		};
	},

	getPitchBendDetune: function( value ) {
		return value * 200;
	}

};

module.exports = utils;
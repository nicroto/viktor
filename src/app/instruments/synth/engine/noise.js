'use strict';

var NOISE_TYPE = [
		"brown",
		"pink",
		"white"
	],
	NOISE_BUFFER_SIZE = 4096;

function Noise( audioContext ) {
	var self = this,
		noiseVolume = audioContext.createGain(),
		sourceNode = audioContext.createScriptProcessor( NOISE_BUFFER_SIZE, 1, 1 );

	noiseVolume.gain.value = 0.0;
	sourceNode.connect( noiseVolume );

	self.volume = self.output = noiseVolume;
	self.sourceNode = sourceNode;
	self._defineProps();
}

Noise.prototype = {

	_defineProps: function() {

		var self = this,
			sourceNode = self.sourceNode,
			volumeNode = self.volume,
			enabled = false,
			level = 0,
			type = "brown";

		Object.defineProperty( self, "enabled", {

			get: function() {
				return enabled;
			},

			set: function( value ) {
				enabled = value;

				if ( !enabled ) {
					sourceNode.disconnect();
				} else {
					sourceNode.connect( volumeNode );
				}
			}

		} );

		Object.defineProperty( self, "level", {

			get: function() {
				return level;
			},

			set: function( value ) {
				level = value;
				volumeNode.gain.value = level;
			}

		} );

		Object.defineProperty( self, "type", {

			get: function() {
				return type;
			},

			set: function( value ) {
				type = value;
				self._changeNoise( sourceNode, NOISE_TYPE[ type ] );
			}

		} );

	},

	_changeNoise: function( sourceNode, type ) {
		var self = this;

		sourceNode.onaudioprocess = self._getNoiseGenerator( type, NOISE_BUFFER_SIZE );
	},

	_getNoiseGenerator: function( type, bufferSize ) {
		// code copied from here:
		//		http://noisehack.com/generate-noise-web-audio-api/
		var generator;

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
	}

};

module.exports = Noise;
'use strict';

var CONST = require( "./const" );

function Filter( audioContext ) {
	var self = this,
		input = audioContext.createGain(),
		simpleFilterNode = audioContext.createBiquadFilter(),
		envelopeFilterNode = audioContext.createBiquadFilter(),
		simpleGain = audioContext.createGain(),
		envelopeGain = audioContext.createGain(),
		output = audioContext.createGain();

	input.gain.value = 1.0;
	simpleGain.gain.value = 1.0;
	envelopeGain.gain.value = CONST.FAKE_ZERO;
	output.gain.value = 1.0;

	envelopeFilterNode.type = "lowpass";
	simpleFilterNode.type = "lowpass";

	input.connect( simpleFilterNode );
	input.connect( envelopeFilterNode );

	simpleFilterNode.connect( simpleGain );
	envelopeFilterNode.connect( envelopeGain );

	simpleGain.connect( output );
	envelopeGain.connect( output );

	Object.defineProperty( self, "cutoff", {
		get: function() {
			var self = this;

			return self.envelopeFilterNode.frequency.value;
		},

		set: function( value ) {
			var self = this;

			self.envelopeFilterNode.frequency.value = value;
			self.simpleFilterNode.frequency.value = value;
		}
	} );

	Object.defineProperty( self, "emphasis", {
		get: function() {
			var self = this;

			return self.envelopeFilterNode.Q.value;
		},

		set: function( value ) {
			var self = this;

			self.envelopeFilterNode.Q.value = value;
			self.simpleFilterNode.Q.value = value;
		}
	} );

	Object.defineProperty( self, "envAmount", {
		get: function() {
			var self = this;

			return self.envelopeGain.gain.value;
		},

		set: function( value ) {
			var self = this;

			self.envelopeGain.gain.value = value;
			self.simpleGain.gain.value = 1 - value;
		}
	} );

	self.inputNode = input;
	self.simpleFilterNode = simpleFilterNode;
	self.envelopeFilterNode = envelopeFilterNode;
	self.simpleGain = simpleGain;
	self.envelopeGain = envelopeGain;
	self.outputNode = output;
}

module.exports = Filter;
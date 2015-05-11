'use strict';

var CONST = require( "./const" );

function Mix( audioContext, firstMixNode, secondMixNode ) {
	var self = this,
		firstGain = audioContext.createGain(),
		secondGain = audioContext.createGain(),
		output = audioContext.createGain();

	firstGain.gain.value = 1.0;
	secondGain.gain.value = CONST.FAKE_ZERO;
	output.gain.value = 1.0;

	firstMixNode.connect( firstGain );
	secondMixNode.connect( secondGain );

	firstGain.connect( output );
	secondGain.connect( output );

	Object.defineProperty( self, "amount", {
		get: function() {
			var self = this;

			return self.secondGain.gain.value;
		},

		set: function( value ) {
			var self = this;
			self.secondGain.gain.value = value;
			self.firstGain.gain.value = 1 - value;
		}
	} );

	self.firstGain = firstGain;
	self.secondGain = secondGain;
	self.output = output;
}

module.exports = Mix;
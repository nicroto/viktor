'use strict';

var utils = require( "./utils" ),
	CONST = require( "./const" );

function Envelope( audioContext, settings ) {
	var self = this,
		node = audioContext.createGain();

	settings = settings || {};

	node.gain.value = 0.0;
	self.audioContext = audioContext;

	self.node = node;

	self.attack =	utils.customOrDefault( settings.attack,		CONST.ENVELOPE.DEFAULT_ATTACK );
	self.decay =	utils.customOrDefault( settings.decay,		CONST.ENVELOPE.DEFAULT_DECAY );
	self.sustain =	utils.customOrDefault( settings.sustain,	CONST.ENVELOPE.DEFAULT_SUSTAIN );
	self.release =	utils.customOrDefault( settings.release,	CONST.ENVELOPE.DEFAULT_RELEASE );
}

Envelope.prototype = {

	start: function( time ) {
		var self = this,
			audioContext = self.audioContext,
			node = self.node,
			attack = self.attack,
			decay = self.decay,
			sustain = self.sustain;

		time = utils.customOrDefault( time, audioContext.currentTime );

		node.gain.cancelScheduledValues( time );
		node.gain.setTargetAtTime( CONST.FAKE_ZERO, time, 0.01 );
		node.gain.setTargetAtTime( 1, time + 0.01, attack / 2 );
		node.gain.setTargetAtTime( sustain, time + 0.01 + attack, decay / 2 );
	},

	end: function( time ) {
		var self = this,
			audioContext = self.audioContext,
			node = self.node,
			release = self.release;

		time = utils.customOrDefault( time, audioContext.currentTime );

		node.gain.cancelScheduledValues( time );
		node.gain.setTargetAtTime( CONST.FAKE_ZERO, time, release );
	}

};

module.exports = Envelope;
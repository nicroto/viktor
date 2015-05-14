'use strict';

var settingsConvertor = require( "settings-convertor" );

var FAKE_ZERO = 0.00001;

function customOrDefault( customValue, defaultValue ) {
	return customValue !== undefined ? customValue : defaultValue;
};


function Envelope( audioContext, propName, upperBound ) {
	var self = this;

	self.audioContext = audioContext;
	self.propName = propName;
	self.upperBound = upperBound;

	self.node = null;

	self._defineProps();
}

Envelope.prototype = {

	_defineProps: function() {

		var self = this,
			attack,
			decay,
			sustain,
			release,
			doubleTransposeValue = function( value ) {
				return 2 * settingsConvertor.transposeValue( value, [ 0, 100 ], [ 0, 1 ] );
			};

		Object.defineProperty( self, "attack", {
			get: function() {
				return attack;
			},

			set: function( value ) {
				attack = doubleTransposeValue( value );
			}
		} );

		Object.defineProperty( self, "decay", {
			get: function() {
				return decay;
			},

			set: function( value ) {
				decay = doubleTransposeValue( value );
			}
		} );

		Object.defineProperty( self, "sustain", {
			get: function() {
				return sustain;
			},

			set: function( value ) {
				sustain = settingsConvertor.transposeValue( value, [ 0, 100 ], [ 0, 1 ] );
			}
		} );

		Object.defineProperty( self, "release", {
			get: function() {
				return release;
			},

			set: function( value ) {
				release = doubleTransposeValue( value );
			}
		} );

	},

	start: function( time ) {
		var self = this,
			audioContext = self.audioContext,
			propName = self.propName,
			upperBound = self.upperBound,
			node = self.node,
			attack = self.attack,
			decay = self.decay,
			sustain = self.sustain;

		time = customOrDefault( time, audioContext.currentTime );

		node[ propName ].cancelScheduledValues( time );
		node[ propName ].setTargetAtTime( FAKE_ZERO, time, 0.01 );
		node[ propName ].setTargetAtTime( upperBound, time + 0.01, attack / 2 );
		node[ propName ].setTargetAtTime( sustain * upperBound, time + 0.01 + attack, decay / 2 );
	},

	end: function( time ) {
		var self = this,
			audioContext = self.audioContext,
			propName = self.propName,
			node = self.node,
			release = self.release;

		time = customOrDefault( time, audioContext.currentTime );

		node[ propName ].cancelScheduledValues( time );
		node[ propName ].setTargetAtTime( FAKE_ZERO, time, release );
	}

};

module.exports = Envelope;
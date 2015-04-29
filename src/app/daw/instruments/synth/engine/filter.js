'use strict';

function Filter( audioContext ) {
	var self = this,
		node = audioContext.createBiquadFilter();

	node.type = "lowpass";

	Object.defineProperty( self, "cutoff", {
		get: function() {
			var self = this;

			return self.node.frequency.value;
		},

		set: function( value ) {
			var self = this;

			self.node.frequency.value = value;
		}
	} );

	Object.defineProperty( self, "emphasis", {
		get: function() {
			var self = this;

			return self.node.Q.value;
		},

		set: function( value ) {
			var self = this;

			self.node.Q.value = value;
		}
	} );

	self.node = node;
}

module.exports = Filter;
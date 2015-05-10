'use strict';

var CONST = require( "./const" );

function Filter( audioContext ) {
	var self = this,
		node = audioContext.createBiquadFilter();

	node.type = "lowpass";

	self.node = node;
}

module.exports = Filter;
'use strict';

module.exports = {

	customOrDefault: function( customValue, defaultValue ) {
		return customValue !== undefined ? customValue : defaultValue;
	}

};
'use strict';

module.exports = {

	transposeValue: function( value, originalRange, newRange ) {
		var originalRangeLenght = originalRange[ 1 ] - originalRange[ 0 ],
			ratioToRange = ( value - originalRange[ 0 ] ) / originalRangeLenght,
			newRangeLength = newRange[ 1 ] - newRange[ 0 ];

		return newRange[ 0 ] + ratioToRange * newRangeLength;
	}

};
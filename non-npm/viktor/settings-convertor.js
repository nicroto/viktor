'use strict';

module.exports = {

	transposeValue: function( value, originalRange, newRange ) {
		var originalRangeLenght = originalRange[ 1 ] - originalRange[ 0 ],
			ratioToRange = ( value - originalRange[ 0 ] ) / originalRangeLenght,
			newRangeLength = newRange[ 1 ] - newRange[ 0 ];

		return newRange[ 0 ] + ratioToRange * newRangeLength;
	},

	transposeParam: function( param, newRange ) {
		var self = this,
			newValue = self.transposeValue( param.value, param.range, newRange );

		return {
			value: newValue,
			range: newRange
		}
	},

	getRangeCenter: function( range ) {
		var rangeLength = range[ 1 ] - range[ 0 ];

		return range[ 0 ] + rangeLength / 2;
	}

};
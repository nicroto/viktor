'use strict';

function WaveformSource( audioContext, customForms ) {
	var self = this,
		customFormTables = {};

	if ( customForms && customForms.length ) {
		for ( var i = 0; i < customForms.length; i++ ) {
			var form = customForms[ i ],
				fft = form.fft,
				size = fft.real.length,
				real = new Float32Array( size ),
				imag = new Float32Array( size );

			for ( var k = 0; k < size; k++ ) {
				real[ k ] = fft.real[ k ];
				imag[ k ] = fft.imag[ k ];
			}

			customFormTables[ form.name ] = audioContext.createPeriodicWave( real, imag );
		}
	}

	self.customForms = customFormTables;
}

WaveformSource.prototype = {

	defaultForms: [
		"sine",
		"square",
		"sawtooth",
		"triangle",
	]

};

module.exports = WaveformSource;
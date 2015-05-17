/* jshint -W083 */

'use strict';

var DEFAULT_OSCILLATOR_COUNT = 3,
	SEMITONE_CENTS = 100,
	OCTAVE_CENTS = 12 * SEMITONE_CENTS;

function OscillatorBank( audioContext, count ) {
	var self = this,
		oscillators = [],
		volumes = [],
		output = audioContext.createGain();

	count = count || DEFAULT_OSCILLATOR_COUNT;

	output.gain.setValueAtTime( 1, 0 );

	for ( var i = 0; i < count; i++ ) {
		var osc = audioContext.createOscillator(),
			volume = audioContext.createGain();

		volume.gain.value = 0.0;
		volume.connect( output );

		osc.frequency.setValueAtTime( 110, 0 );
		osc.connect( volume );
		osc.start( 0 );

		volumes.push( volume );
		oscillators.push( osc );
	}

	self.audioContext = audioContext;
	self.oscillators = oscillators;
	self.volumes = volumes;
	self.output = output;

	self._defineProps();
}

OscillatorBank.prototype = {

	forEach: function( callback ) {
		var self = this;

		if ( !callback ) {
			return self;
		}

		for ( var i = 0; i < self.oscillators.length; i++ ) {
			callback( self[ "oscillator" + ( i + 1 ) ], i );
		}

		return self;
	},

	_defineProps: function() {

		var self = this,
			oscillators = self.oscillators,
			volumes = self.volumes,
			note;

		for ( var i = 0; i < oscillators.length; i++ ) {
			var oscillator = oscillators[ i ],
				volume = volumes[ i ],
				oscPropName = "oscillator" + ( i + 1 ),
				oscProp = self[ oscPropName ] = {};

			( function( osc, vol ) {
				var enabled = false, waveform = "sine", customWaveform, cent = 0, semitone = 0, octave = 0, level = 100;

				Object.defineProperty( oscProp, "enabled", {

					get: function() {
						return enabled;
					},

					set: function( value ) {
						enabled = value;

						if ( enabled ) {
							osc.connect( vol );
						} else {
							osc.disconnect();
						}
					}

				} );

				Object.defineProperty( oscProp, "waveform", {

					get: function() {
						return waveform;
					},

					set: function( value ) {
						waveform = value;

						self._resolveWaveform( waveform, osc );
					}

				} );

				Object.defineProperty( oscProp, "customWaveform", {

					get: function() {
						return customWaveform;
					},

					set: function( value ) {
						customWaveform = value;

						self._resolveCustomWaveform( customWaveform, osc );
					}

				} );

				Object.defineProperty( oscProp, "cent", {

					get: function() {
						return cent;
					},

					set: function( value ) {
						cent = value;

						self._resolveDetune( octave, semitone, cent, osc );
					}

				} );

				Object.defineProperty( oscProp, "semitone", {

					get: function() {
						return semitone;
					},

					set: function( value ) {
						semitone = value;

						self._resolveDetune( octave, semitone, cent, osc );
					}

				} );

				Object.defineProperty( oscProp, "octave", {

					get: function() {
						return octave;
					},

					set: function( value ) {
						octave = value;

						self._resolveDetune( octave, semitone, cent, osc );
					}

				} );

				Object.defineProperty( oscProp, "level", {

					get: function() {
						return level;
					},

					set: function( value ) {
						level = value;

						vol.gain.setValueAtTime( level, 0 );
					}

				} );

			} )( oscillator, volume );
		}

		Object.defineProperty( self, "note", {

			get: function() {
				return note;
			},

			set: function( value ) {
				note = value;

				oscillators.forEach( function( osc ) {
					self._setNoteToOscillator( osc, note );
				} );
			}

		} );

	},

	_resolveWaveform: function( waveform, osc ) {
		if ( waveform ) {
			osc.type = waveform;
		}
	},

	_resolveCustomWaveform: function( waveTable, osc ) {
		if ( waveTable ) {
			osc.setPeriodicWave( waveTable );
		}
	},

	_setNoteToOscillator: function( oscillator, note ) {
		oscillator.frequency.cancelScheduledValues( 0 );
		oscillator.frequency.setTargetAtTime(
			note.frequency,
			0,
			note.portamento
		);
	},

	_resolveDetune: function( octave, semitone, cent, oscillator ) {
		oscillator.detune.setValueAtTime( octave * OCTAVE_CENTS + semitone * SEMITONE_CENTS + cent, 0 );
	}

};

module.exports = OscillatorBank;
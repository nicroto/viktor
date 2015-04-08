'use strict';

var $ = require( "jquery" ),
	DAW = require( "./daw/daw" ),
	Synth = require( "./synth/instrument" ),
	AudioContext = window.AudioContext || window.webkitAudioContext,
	daw;

$( document ).ready( function() {

	daw = new DAW( AudioContext );

	daw.init( function() {

		daw.addInstrument( Synth );

	} );

} );
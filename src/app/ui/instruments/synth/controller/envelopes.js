'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "EnvelopesCtrl", [ "$scope", "synth", function( $scope, synth ) {
		var self = this,
			settingsChangeHandler = function() {
				synth.envelopesSettings = {
					primary: {
						attack: settingsConvertor.transposeParam( self.primary.attack, primary.attack.range ),
						decay: settingsConvertor.transposeParam( self.primary.decay, primary.decay.range ),
						sustain: settingsConvertor.transposeParam( self.primary.sustain, primary.sustain.range ),
						release: settingsConvertor.transposeParam( self.primary.release, primary.release.range )
					},
					filter: {
						attack: settingsConvertor.transposeParam( self.filter.attack, filter.attack.range ),
						decay: settingsConvertor.transposeParam( self.filter.decay, filter.decay.range ),
						sustain: settingsConvertor.transposeParam( self.filter.sustain, filter.sustain.range ),
						release: settingsConvertor.transposeParam( self.filter.release, filter.release.range )
					}
				};
			},
			settings = synth.envelopesSettings,
			primary = settings.primary,
			filter = settings.filter;

		self.primary = {
			attack: settingsConvertor.transposeParam( primary.attack, [ 0, 100 ] ),
			decay: settingsConvertor.transposeParam( primary.decay, [ 0, 100 ] ),
			sustain: settingsConvertor.transposeParam( primary.sustain, [ 0, 100 ] ),
			release: settingsConvertor.transposeParam( primary.release, [ 0, 100 ] )
		};
		self.filter = {
			attack: settingsConvertor.transposeParam( filter.attack, [ 0, 100 ] ),
			decay: settingsConvertor.transposeParam( filter.decay, [ 0, 100 ] ),
			sustain: settingsConvertor.transposeParam( filter.sustain, [ 0, 100 ] ),
			release: settingsConvertor.transposeParam( filter.release, [ 0, 100 ] )
		};

		[
			"envs.primary.attack.value",
			"envs.primary.decay.value",
			"envs.primary.sustain.value",
			"envs.primary.release.value",
			"envs.filter.attack.value",
			"envs.filter.decay.value",
			"envs.filter.sustain.value",
			"envs.filter.release.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix the lack of attr 'value' update
		$( ".envelopes webaudio-knob" ).on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "envelopes", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "envelopes.html" )
		};
	} ] );

};
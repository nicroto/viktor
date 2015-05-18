'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "NoiseCtrl", [ "$scope", "$timeout", "dawEngine", "synth", "patchLibrary", function( $scope, $timeout, dawEngine, synth, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				synth.noiseSettings = {
					enabled: self.enabled,
					level: settingsConvertor.transposeParam( self.level, settings.level.range ),
					type: self.type
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = synth.noiseSettings;

				self.enabled = settings.enabled;
				self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );
				self.type = settings.type;

				// fix problem with bad init state
				$timeout( function() {
					$( ".noise webaudio-switch" )[ 0 ].setValue( self.enabled.value );
					$( ".noise webaudio-slider" )[ 0 ].setValue( self.type.value );
				}, 300 );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"noise.enabled.value",
					"noise.level.value",
					"noise.type.value"
				].forEach( function( path ) {
					watchers.push( $scope.$watch( path, settingsChangeHandler ) );
				} );
			},
			unregisterFromChanges = function() {
				watchers.forEach( function( unregister ) {
					unregister();
				} );
				watchers = [];
			};

		pollSettings();

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
		} );

		// fix the lack of attr 'value' update
		$( ".noise webaudio-switch" )
			.add( ".noise webaudio-knob" )
			.add( ".noise webaudio-slider" )
		.on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "noise", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "noise.html" )
		};
	} ] );

};
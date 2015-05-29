'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "ReverbCtrl", [ "$scope", "$timeout", "dawEngine", "patchLibrary", function( $scope, $timeout, dawEngine, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.reverbSettings = {
					level: settingsConvertor.transposeParam( self.level, settings.level.range )
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function( time ) {
				settings = dawEngine.reverbSettings;
				self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );

				// fix problem with bad init state
				$timeout( function() {
					$( ".reverb webaudio-slider" )[ 0 ].setValue( self.level.value );
				}, time );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"reverb.level.value"
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

		pollSettings( 300 );

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
		} );
	} ] );

	mod.directive( "reverb", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "reverb.html" )
		};
	} ] );

};
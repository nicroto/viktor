'use strict';

var settingsConvertor = require( "viktor-nv1-settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "DelayCtrl", [ "$scope", "dawEngine", "patchLibrary", function( $scope, dawEngine, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.delaySettings = {
					time	: settingsConvertor.transposeParam( self.time, settings.time.range ),
					feedback: settingsConvertor.transposeParam( self.feedback, settings.feedback.range ),
					dry		: settingsConvertor.transposeParam( self.dry, settings.dry.range ),
					wet		: settingsConvertor.transposeParam( self.wet, settings.wet.range )
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			pollSettings = function() {
				settings = dawEngine.delaySettings;

				self.time = settingsConvertor.transposeParam( settings.time, [ 0, 100 ] );
				self.feedback = settingsConvertor.transposeParam( settings.feedback, [ 0, 100 ] );
				self.dry = settingsConvertor.transposeParam( settings.dry, [ 0, 100 ] );
				self.wet = settingsConvertor.transposeParam( settings.wet, [ 0, 100 ] );
			},
			watchers = [],
			registerForChanges = function() {
				[
					"delay.time.value",
					"delay.feedback.value",
					"delay.dry.value",
					"delay.wet.value"
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
	} ] );

	mod.directive( "delay", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "delay.html" )
		};
	} ] );

};
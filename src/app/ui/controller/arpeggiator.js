'use strict';

module.exports = function( mod ) {

	mod.controller( "ArpeggiatorCtrl", [ "$scope", "globalVars", "dawEngine", "patchLibrary", function( $scope, globalVars, dawEngine, patchLibrary ) {
		var self = this,
			settingsChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.arpeggiatorSettings = {
					enabled: self.enabled,
					hold: self.hold,
					reset: self.reset,
					direction: self.direction,
					rate: self.rate,
					range: self.range,
					gate: self.gate,
					scale: self.scale,
					velSlope: self.velSlope
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			tempoChangeHandler = function( newValue, oldValue ) {
				if ( newValue === oldValue ) {
					return;
				}

				dawEngine.tempoSettings = {
					bpm: self.bpm
				};

				patchLibrary.preserveUnsaved( dawEngine.getPatch() );
			},
			settings,
			tempoSettings,
			pollSettings = function() {
				settings = dawEngine.arpeggiatorSettings;
				tempoSettings = dawEngine.tempoSettings;

				self.enabled = settings.enabled;
				self.hold = settings.hold;
				self.reset = settings.reset;
				self.direction = settings.direction;
				self.rate = settings.rate;
				self.range = settings.range;
				self.gate = settings.gate;
				self.scale = settings.scale;
				self.velSlope = settings.velSlope;
				self.bpm = tempoSettings.bpm;
			},
			watchers = [],
			registerForChanges = function() {
				[
					"arp.enabled.value",
					"arp.hold.value",
					"arp.reset.value",
					"arp.direction.value",
					"arp.rate.value",
					"arp.range.value",
					"arp.gate.value",
					"arp.scale.value",
					"arp.velSlope.value"
				].forEach( function( path ) {
					watchers.push( $scope.$watch( path, settingsChangeHandler ) );
				} );
				watchers.push( $scope.$watch( "arp.bpm.value", tempoChangeHandler ) );
			},
			unregisterFromChanges = function() {
				watchers.forEach( function( unregister ) {
					unregister();
				} );
				watchers = [];
			};

		self.knobWidth = Math.round( 45 * globalVars.sizeRatio );
		self.smallKnobWidth = Math.round( 40 * globalVars.sizeRatio );

		self.directionLabels = [ "Up", "Down", "Up/Dn", "Dn/Up", "Rand" ];
		self.rateLabels = [ "1/4", "1/8", "1/16", "1/8T", "1/16T" ];
		self.scaleLabels = [ "Off", "Maj", "Min", "Pent", "Blues" ];

		self.setDirection = function( dir ) {
			self.direction.value = dir;
			settingsChangeHandler( dir, null );
		};

		pollSettings();

		registerForChanges();

		dawEngine.onPatchChange( function() {
			unregisterFromChanges();
			pollSettings();
			registerForChanges();
		} );
	} ] );

	mod.directive( "arpeggiator", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "arpeggiator.html" )
		};
	} ] );

};

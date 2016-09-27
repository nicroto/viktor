'use strict';

module.exports = function( mod ) {

    mod.controller( "SettingsCtrl", [ "$scope", "$modal", "dawEngine",
    function( $scope, $modal, dawEngine ) {
        var self = this;

        self.openSettingsModal = function() {
            $modal.open( {
                animation: $scope.animationsEnabled,
                templateUrl: 'settingsModal.html',
                controller: 'SettingsModalCtrl',
                controllerAs: 'settingsModal',
                size: null,
                resolve: {
                    midiController: function() {
                        return dawEngine.midiController;
                    }
                }
            } );
        };

    } ] );

    mod.controller( "SettingsModalCtrl", [ "$modalInstance", "$window", "midiController",
    function( $modalInstance, $window, midiController ) {
        var self = this,
            onMidiMessageFunc = midiController.onMidiMessage.bind( midiController );

        self.midiInputs = midiController.inputs;

        self.inputStateChange = function( input ) {
            if ( input.value.onmidimessage !== null ) {
                input.value.onmidimessage = null;
            } else {
                input.value.onmidimessage = onMidiMessageFunc;
            }
        };

        self.close = function() {
            $modalInstance.dismiss();
        };
    } ] );

    mod.directive( "settings", [ "$templateCache", function( $templateCache ) {
        return {
            restrict: "E",
            replace: true,
            template: $templateCache.get( "settings.html" )
        };
    } ] );

    mod.directive( "autofocus", function() {
        return {
            restrict: "A",
            link: function ( scope, element ) {
                element[0].focus();
            }
        };
    } );

};
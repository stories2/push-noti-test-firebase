app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, ADSModuleService) {

    $scope.title = "ADS Console";
    $scope.isUserSignedIn = false;

    ADSModuleService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                ADSModuleService.printLogMessage("ToolbarController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
                // ...
            } else {
                // User is signed out.
                // ...
                ADSModuleService.printLogMessage("ToolbarController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)
            }
        });
    }
});
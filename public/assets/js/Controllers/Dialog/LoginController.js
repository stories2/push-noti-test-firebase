app.controller("LoginController", function ($scope, $http, $mdToast, $mdSidenav, ADSModuleService) {

    $scope.isUserSignedIn = false;

    ADSModuleService.printLogMessage("LoginController", "LoginController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                ADSModuleService.printLogMessage("LoginController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
                // ...
            } else {
                // User is signed out.
                // ...
                ADSModuleService.printLogMessage("LoginController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)
            }
        });
    }
});
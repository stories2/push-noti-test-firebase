app.controller("LoginController", function ($scope, $http, $mdToast, $mdDialog, $mdSidenav, ADSModuleService) {

    $scope.isUserSignedIn = false;

    ADSModuleService.printLogMessage("LoginController", "LoginController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                ADSModuleService.printLogMessage("LoginController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)

                $scope.$apply(function () {
                    $scope.isUserSignedIn = true
                })
                // ...
            } else {
                // User is signed out.
                // ...
                ADSModuleService.printLogMessage("LoginController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)

                $scope.$apply(function () {
                    $scope.isUserSignedIn = false
                })
            }
        });
    }
    
    $scope.signOutUser = function () {
        ADSModuleService.printLogMessage("LoginController", "signOutUser", "start process sign out user", LOG_LEVEL_INFO)
        tryToSignOutUser()
    }
    
    $scope.signInUser = function () {
        ADSModuleService.printLogMessage("LoginController", "signInUser", "start process sign in user", LOG_LEVEL_INFO)
        tryToSignInUsingGooglAuth()
    }

    function tryToSignOutUser() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            ADSModuleService.printLogMessage("LoginController", "tryToSignOutUser", "sign out successfully", LOG_LEVEL_INFO)
            $scope.$apply(function () {
                $scope.isUserSignedIn = false
            })
        }).catch(function(error) {
            // An error happened.
            ADSModuleService.printLogMessage("LoginController", "tryToSignOutUser", "cannot sign out: " + JSON.stringify(error), LOG_LEVEL_ERROR)
        });
    }

    function tryToSignInUsingGooglAuth() {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            ADSModuleService.printLogMessage("LoginController", "tryToSignInUsingGooglAuth", "sign in success: " + JSON.stringify(result), LOG_LEVEL_DEBUG)
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            ADSModuleService.printLogMessage("LoginController", "tryToSignInUsingGooglAuth", "sign in failed: " + JSON.stringify(error), LOG_LEVEL_ERROR)
        });
    }
});
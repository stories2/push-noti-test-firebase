app.controller("DashboardController", function ($scope, $http, $mdToast, $mdSidenav, ADSModuleService) {

    $scope.deployClientStatusDic = {}

    ADSModuleService.printLogMessage("DashboardController", "DashboardController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                ADSModuleService.printLogMessage("DashboardController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
                LoadLatestDeployStatus()

                // ...
            } else {
                // User is signed out.
                // ...
                ADSModuleService.printLogMessage("DashboardController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)

                
            }
        });
    }
    
    function LoadLatestDeployStatus() {
        ADSModuleService.printLogMessage("DashboardController", "LoadLatestDeployStatus", "load status db", LOG_LEVEL_INFO)

        firebase.database().ref(DB_PATH_DEPLOY_STATUS).once('value').then(function(snapshot) {

            ADSModuleService.printLogMessage("DashboardController", "LoadLatestDeployStatus", "status dic: " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)

            $scope.$apply(function () {
                $scope.deployClientStatusDic = snapshot.val()
            })
        });
    }
});
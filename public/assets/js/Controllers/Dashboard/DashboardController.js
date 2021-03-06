app.controller("DashboardController", function ($scope, $http, $mdToast, $mdSidenav, $mdDialog, ADSModuleService) {

    $scope.deployClientStatusDic = {}
    $scope.deployClientStatusCodeDic = {}
    $scope.lastRefreshTime = ""

    ADSModuleService.printLogMessage("DashboardController", "DashboardController", "init", LOG_LEVEL_INFO);

    $scope.listenAuthStateChanged = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                ADSModuleService.printLogMessage("DashboardController", "listenAuthStateChanged", "user signed in: " + JSON.stringify(user), LOG_LEVEL_DEBUG)
                LoadLatestDeployStatus()
                LoadDeployStatusCode()
                // ...
            } else {
                // User is signed out.
                // ...
                ADSModuleService.printLogMessage("DashboardController", "listenAuthStateChanged", "user not signed in", LOG_LEVEL_WARN)
            }
        });
    }

    $scope.onBtnDetailClicked = function (statusDetail) {
        ADSModuleService.printLogMessage("DashboardController", "onBtnDetailClicked", "show detail data: " + JSON.stringify(statusDetail), LOG_LEVEL_DEBUG)
        ShowDetailDialog(statusDetail)
    }
    
    $scope.onBtnRefreshClicked = function () {
        ADSModuleService.printLogMessage("DashboardController", "onBtnRefreshClicked", "refresh deploy status", LOG_LEVEL_INFO)
        LoadLatestDeployStatus()

        CheckAllDeployStatus()
    }
    
    function LoadLatestDeployStatus() {
        ADSModuleService.printLogMessage("DashboardController", "LoadLatestDeployStatus", "load status db", LOG_LEVEL_INFO)

        firebase.database().ref(DB_PATH_DEPLOY_STATUS).once('value').then(function(snapshot) {

            ADSModuleService.printLogMessage("DashboardController", "LoadLatestDeployStatus", "status dic: " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)

            $scope.$apply(function () {
                $scope.lastRefreshTime = new Date().toISOString()
                $scope.deployClientStatusDic = snapshot.val()
            })
        });
    }

    function LoadDeployStatusCode() {
        ADSModuleService.printLogMessage("DashboardController", "LoadDeployStatusCode", "load registered deploy status code", LOG_LEVEL_DEBUG)

        firebase.database().ref(DB_PATH_DEPLOY_STATUS_CODE).once('value').then(function(snapshot) {

            ADSModuleService.printLogMessage("DashboardController", "LoadDeployStatusCode", "status code dic: " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)

            $scope.$apply(function () {
                $scope.deployClientStatusCodeDic = snapshot.val()
            })
        });
    }

    function CheckAllDeployStatus() {

        ADSModuleService.printLogMessage("DashboardController", "CheckAllDeployStatus", "check all deploy server status", LOG_LEVEL_INFO)

        firebase.database().ref(DB_PATH_DEPLOY_PROFILE).once('value').then(function(snapshot) {
            ADSModuleService.printLogMessage("DashboardController", "CheckAllDeployStatus", "snapshot: " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)
            for(serverName in snapshot.val()) {

                const requestData = {
                    "orderType": 2,
                    "msg": "Check all deploy status",
                    "callbackUrl": URL_CALLBACK + serverName,
                    "pushRegisteredID": serverName
                }

                ADSModuleService.printLogMessage("DashboardController", "CheckAllDeployStatus", "send to " + serverName, LOG_LEVEL_DEBUG)

                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                    // Send token to your backend via HTTPS
                    // ...
                    ADSModuleService.postReq(URL_PUSH_MSG_SEND,
                        requestData,
                        function (successData) {
                            ADSModuleService.printLogMessage("DashboardController", "CheckAllDeployStatus", "successfully request push msg: " + JSON.stringify(successData), LOG_LEVEL_DEBUG)
                        },
                        function (error) {
                            ADSModuleService.printLogMessage("DashboardController", "CheckAllDeployStatus", "cannot request push msg: " + JSON.stringify(error), LOG_LEVEL_ERROR)
                        }, idToken)
                })

            }
        })

    }

    function ShowDetailDialog(statusDetail) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/dialog/DeployStatusDetail.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
                'statusDetail': statusDetail
            },
            // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                // $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                // $scope.status = 'You cancelled the dialog.';
            });
    }

    function DialogController($scope, $mdDialog, statusDetail) {

        $scope.statusDetailDic = statusDetail

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }
});
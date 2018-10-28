app.controller("DeployController", function ($scope, $http, $mdToast, $mdDialog, $mdSidenav, ADSModuleService) {

    ADSModuleService.printLogMessage("DeployController", "DeployController", "init", LOG_LEVEL_INFO);

    $scope.onBtnPublishClicked = function () {
        ADSModuleService.printLogMessage("DeployController", "onBtnPublishClicked", "make new publish", LOG_LEVEL_INFO)
        ShowDeployRequestDialog()
    }

    function ShowDeployRequestDialog() {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/dialog/DeployRequest.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
            },
            // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                // $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                // $scope.status = 'You cancelled the dialog.';
            });
    }

    function DialogController($scope, $mdDialog) {

        $scope.deployRequest = {}
        $scope.profileList = {}
        $scope.orderType = {}

        $scope.onInit = function() {
            ADSModuleService.printLogMessage("DialogController", "onInit", "init", LOG_LEVEL_INFO)
            GetDeployProfileList()
            GetOrderTypeList()
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $scope.deployRequest["callbackUrl"] = URL_CALLBACK + $scope.deployRequest.pushRegisteredID
            $scope.deployRequest["fileType"] = "zip"

            ADSModuleService.printLogMessage("DialogController", "answer", "deploy request data: " + JSON.stringify($scope.deployRequest), LOG_LEVEL_DEBUG)

            $mdDialog.hide(answer);
        };

        function GetDeployProfileList() {
            firebase.database().ref(DB_PATH_DEPLOY_PROFILE).once('value').then(function(snapshot) {

                ADSModuleService.printLogMessage("DialogController", "GetDeployProfileList", "deploy profile dic : " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)

                $scope.$apply(function () {
                    $scope.profileList = snapshot.val()
                })
            });
        }

        function GetOrderTypeList() {
            firebase.database().ref(DB_PATH_DEPLOY_ORDER_TYPE).once('value').then(function(snapshot) {

                ADSModuleService.printLogMessage("DialogController", "GetOrderTypeList", "order type dic : " + JSON.stringify(snapshot.val()), LOG_LEVEL_DEBUG)

                $scope.$apply(function () {
                    $scope.orderType = snapshot.val()
                })
            });
        }
    }
})
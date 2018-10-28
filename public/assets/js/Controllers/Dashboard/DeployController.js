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
            .then(function(requestData) {
                // $scope.status = 'You said the information was "' + answer + '".';
                ADSModuleService.printLogMessage("DeployController", "ShowDeployRequestDialog", "request: " + JSON.stringify(requestData), LOG_LEVEL_DEBUG)
                if(requestData["readyForDeploy"]) {
                    SendPushMsgRequest(requestData)
                }
            }, function() {
                // $scope.status = 'You cancelled the dialog.';
            });
    }

    function SendPushMsgRequest(requestData) {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...

            ADSModuleService.postReq(URL_PUSH_MSG_SEND,
                requestData,
                function (successData) {
                    ADSModuleService.printLogMessage("DeployController", "SendPushMsgRequest", "successfully request push msg: " + JSON.stringify(successData), LOG_LEVEL_DEBUG)
                },
                function (error) {
                    ADSModuleService.printLogMessage("DeployController", "SendPushMsgRequest", "cannot request push msg: " + JSON.stringify(error), LOG_LEVEL_ERROR)
                }, idToken)
        }).catch(function(error) {
            // Handle error
            ADSModuleService.printLogMessage("DeployController", "SendPushMsgRequest", "cannot generate token: " + JSON.stringify(error), LOG_LEVEL_ERROR)
        });
    }

    function DialogController($scope, $mdDialog) {

        $scope.deployRequest = {}
        $scope.profileList = {}
        $scope.orderType = {}

        $scope.onInit = function() {
            ADSModuleService.printLogMessage("DialogController", "onInit", "init", LOG_LEVEL_INFO)
            $scope.deployRequest["readyForDeploy"] = false
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
            if(answer == FORM_OK) {
                $scope.deployRequest["callbackUrl"] = URL_CALLBACK + $scope.deployRequest.pushRegisteredID
                $scope.deployRequest["fileType"] = "zip"
                $scope.deployRequest["readyForDeploy"] = true

                ADSModuleService.printLogMessage("DialogController", "answer", "deploy request data: " + JSON.stringify($scope.deployRequest), LOG_LEVEL_DEBUG)
            }
            $mdDialog.hide($scope.deployRequest);
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
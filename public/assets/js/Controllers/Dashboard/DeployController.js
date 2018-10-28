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
})
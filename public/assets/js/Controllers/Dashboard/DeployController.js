app.controller("DeployController", function ($scope, $http, $mdToast, $mdDialog, $mdSidenav, ADSModuleService) {

    ADSModuleService.printLogMessage("DeployController", "DeployController", "init", LOG_LEVEL_INFO);

    $scope.onBtnPublishClicked = function () {
        ADSModuleService.printLogMessage("DeployController", "onBtnPublishClicked", "make new publish", LOG_LEVEL_INFO)
    }
})
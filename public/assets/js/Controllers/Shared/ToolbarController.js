app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, ADSModuleService) {
    $scope.title = "ADS Console";
    ADSModuleService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);
});
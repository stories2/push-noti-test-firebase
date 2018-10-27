app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, ADCModuleService) {
    $scope.title = "ADC Console";
    ADCModuleService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);
});
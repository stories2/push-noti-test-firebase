var app = angular.module('ADSModule', ['ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngMaterial']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "/static/partials/index.html",
            controller : "indexController",
            cache: false,
            disableCache: true,
        })
        .when("/chapel", {
            templateUrl : "../static/partials/chapel/chapelReport.html",
            // controller : "chapelReportController"
            cache: false,
            disableCache: true,
        })
        .when("/score", {
            templateUrl : "../static/partials/student/scoreReport.html",
            // controller : "chapelReportController"
            cache: false,
            disableCache: true,
        }).otherwise({
        redirectTo: '/',
        cache: false,
        disableCache: true,
    });
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $rootScope) {
        return {
            'request': function (config) {
                // intercepts the request
                $('#spinnerView').show();
                return config;
            },
            'response': function (response) {
                // intercepts the response. you can examine things like status codes
                $('#spinnerView').hide();
                return response;
            },
            'responseError': function (response) {
                // intercepts the response when the response was an error
                $('#spinnerView').hide();
                return response;
            }
        };
    });
});

app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});
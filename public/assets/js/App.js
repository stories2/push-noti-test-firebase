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
            templateUrl : "templates/partials/login.html",
            controller : "LoginController",
            cache: false,
            disableCache: true,
        })
        .otherwise({
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
var app = angular.module('app', [ 'ngRoute',  'TestCtrl',  'LoginCtrl', 'SubscriberCtrl',  'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'MockDataService', 'AuthDataService']);

// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, AuthWrapper) {

    var config = {
        databaseURL: "https://online-school-dev.firebaseio.com",
        storageBucket: "online-school-dev.appspot.com"
    }

    firebase.initializeApp(config); 
    $rootScope.storage = firebase.storage();

    $rootScope.$on('$locationChangeStart', function (event, next, current) {});

});

// Routing ----------------------------------------------
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    $routeProvider

       .when('/', {
        templateUrl: '../views/test.html',
        controller: 'TestController',
        controllerAs: 'test',
        authenticated: false
        })
        .when('/publisher', {
            templateUrl: '../views/publisher.html',
            controller: 'PublisherController',
            controllerAs: 'publisher',
            authenticated: false
        })
        .when('/subscriber', {
                templateUrl: '../views/subscriber.html',
                controller: 'SubscriberController',
                controllerAs: 'subscriber',
                authenticated: false
        })
        .when('/login', {
            templateUrl: '../views/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
            authenticated: false
        })
        .when('/profile', {
            templateUrl: '../views/profile.html',
            controller: 'ProfileController',
            controllerAs: 'profile',
            authenticated: true
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
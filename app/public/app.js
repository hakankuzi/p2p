var app = angular.module('app', [ 'ngRoute', 'SignupCtrl','TestCtrl',  'LoginCtrl', 'SubscriberCtrl',  'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'MockDataService', 'AuthDataService']);

// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, AuthWrapper) {

    var config = {
        apiKey: "AIzaSyA7F_X1u_aP97NkDHm0T6lJEpt-WUIuucg",
        authDomain: "online-school-dev.firebaseapp.com",
        databaseURL: "https://online-school-dev.firebaseio.com",
        projectId: "online-school-dev",
        storageBucket: "online-school-dev.appspot.com",
        messagingSenderId: "190057098945",
        appId: "1:190057098945:web:ba77a116ec435c98372e40"
    }

    firebase.initializeApp(config); 
    $rootScope.storage = firebase.storage();
    $rootScope.auth= firebase.auth();
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
        .when('/signup', {
            templateUrl: '../views/signup.html',
            controller: 'SignupController',
            controllerAs: 'signup',
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
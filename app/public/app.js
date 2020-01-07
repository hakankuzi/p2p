var app = angular.module('app', [ 'ngRoute', 'LoginCtrl', 'ProfileCtrl', 'IndexCtrl', 'MockDataService', 'AuthDataService']);


// Environments -----------------------------------------
// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, AuthWrapper) {

    let config = {
        databaseURL: "https://online-school-dev.firebaseio.com",
        storageBucket: "online-school-dev.appspot.com"
    }

    firebase.initializeApp(config); 
    $rootScope.storage = firebase.storage();


    $rootScope.$on('$locationChangeStart', function (event, next, current) {

    });
});

// Routing ----------------------------------------------
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    $routeProvider
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
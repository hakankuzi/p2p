var app = angular.module('app', ['ngRoute', 'SignupCtrl', 'TestCtrl', 'LoginCtrl', 'SubscriberCtrl', 'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'CrudDataService', 'MockDataService', 'AuthDataService']);

// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, MockData, AuthWrapper) {

    $rootScope.apis = {};
    $rootScope.json = {};
    $rootScope.apis.menus = '/api/getMenusByRoles';
    $rootScope.apis.createUser = '/api/createUser';
    $rootScope.apis.updateUser = '/api/updateUser';
    $rootScope.apis.deleteUser = '/api/deleteUser';
    $rootScope.apis.getUser = '/api/getUser';
    $rootScope.apis.getUserWithEmailAndPassword = '/api/getUserWithEmailAndPassword';
    $rootScope.apis.listAllUsers = '/api/listAllUsers';

    /*
    MockData.service({ roles: ['admin'] }, $rootScope.apis.menus, (response) => {
        console.log(response);
    });
    */

    $rootScope.$on('$locationChangeStart', function (event, next, current) { });

    // listen for auth status changes
    /*
    $rootScope.auth.onAuthStateChanged(user => {
        console.log('state changed');
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            console.log('user logged in: ', user);
        } else {
            console.log('user logged out');
        }
    });
    */



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
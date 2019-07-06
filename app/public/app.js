var app = angular.module('app', ['firebase', 'ngRoute', 'TestCtrl', 'LoginCtrl', 'ProfileCtrl', 'IndexCtrl', 'P2PService', 'MockDataService', 'AuthDataService']);


// Environments -----------------------------------------
// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, AuthWrapper) {
    var firebaseConfig = {
        apiKey: "AIzaSyC9QcjpuN3J4DB7B_d8lYswFYnGertxIP8",
        authDomain: "timetohelpapp.firebaseapp.com",
        databaseURL: "https://timetohelpapp.firebaseio.com",
        projectId: "timetohelpapp",
        storageBucket: "timetohelpapp.appspot.com",
        messagingSenderId: "43177694110"
    }
    // Connect to Firebase --------------
    firebase.initializeApp(firebaseConfig);

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var IsAuthenticated = next.$$route.authenticated;
        if (IsAuthenticated) {
            if (AuthWrapper.isLoggedIn()) {
                console.log('Success : User is logged in');
                AuthWrapper.getUser().then(function (data) {
                    $rootScope.loggedIn = AuthWrapper.isLoggedIn();
                    $rootScope.username = data.username;
                    $rootScope.email = data.email;
                    console.log(data);
                });
            } else {
                console.log('Failure : User is NOT logged in');
                $location.path('/login');
            }
        }
    });

    $rootScope.$on('$locationChangeStart', function (event, next, current) {

    });
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
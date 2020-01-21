var app = angular.module('app', ['ngRoute', 'TestCtrl', 'CoreService', 'DepartmentCtrl', 'CourseCtrl', 'DashboardCtrl', 'SignupCtrl', 'LoginCtrl', 'SubscriberCtrl', 'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'CrudDataService', 'MockDataService', 'AuthDataService']);

// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, MockData, AuthToken, AuthWrapper) {

    // variables and api names ---------------------------------
    $rootScope.apis = {};
    $rootScope.menus = [];
    $rootScope.loggedIn = AuthWrapper.isLoggedIn();



    $rootScope.apis.menus = '/api/getMenusByRoles';
    $rootScope.apis.createUser = '/api/createUser';
    $rootScope.apis.updateUser = '/api/updateUser';
    $rootScope.apis.deleteUser = '/api/deleteUser';
    $rootScope.apis.getUser = '/api/getUser';
    $rootScope.apis.getDepartments = '/api/getDepartments';
    $rootScope.apis.addDepartment = '/api/addDepartment';
    $rootScope.apis.updateDepartment = '/api/updateDepartment';
    $rootScope.apis.getCourses = '/api/getCourses';
    $rootScope.apis.getFirebaseConfig = '/api//getFirebaseConfig';
    $rootScope.apis.me = '/api/me';
    $rootScope.apis.token = '/api/token';
    $rootScope.apis.getPaymentByUid = '/api/getPaymentsByUid';
    $rootScope.apis.getUserWithEmailAndPassword = '/api/getUserWithEmailAndPassword';
    $rootScope.apis.listAllUsers = '/api/listAllUsers';
    // ----------------------------------------------------------------
    if ($rootScope.menus.length === 0) {
        AuthWrapper.service({}, $rootScope.apis.me, (response) => {
            if (response.data.status === '200') {
                $rootScope.menus = response.data.user.menus;
                $rootScope.user = response.data.user;
            } else {
                $location.path('/login')
            }
        });
    }
    // ----------------------------------------------------------------
    // Change Route and Check Authorize --------------------------------
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var authenticated = next.$$route.authenticated;

        if ($rootScope.loggedIn) {
            if (!authenticated) {
                $location.path('/dashboard');
            } else {

            }
        } else {
            if (authenticated) {
                $location.path('/login');
            }
        }
    });
    // -----------------------------------------------------------------
});

// Routing ----------------------------------------------
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    $routeProvider

        .when('/', {
            templateUrl: '../views/test.html',
            controller: 'TestController',
            controllerAs: 'test',
            authenticated: true
        })
        .when('/department', {
            templateUrl: '../views/department.html',
            controller: 'DepartmentController',
            controllerAs: 'department',
            authenticated: true
        })
        .when('/course', {
            templateUrl: '../views/courses.html',
            controller: 'CourseController',
            controllerAs: 'course',
            authenticated: true
        })
        .when('/dashboard', {
            templateUrl: '../views/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            authenticated: true
        })
        .when('/publisher', {
            templateUrl: '../views/publisher.html',
            controller: 'PublisherController',
            controllerAs: 'publisher',
            authenticated: true
        })
        .when('/subscriber', {
            templateUrl: '../views/subscriber.html',
            controller: 'SubscriberController',
            controllerAs: 'subscriber',
            authenticated: true
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
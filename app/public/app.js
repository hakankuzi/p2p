var app = angular.module('app', ['ngRoute', 'TestCtrl', 'LessonCtrl', 'PackageCtrl', 'LevelCtrl', 'DepartmentCtrl', 'CourseCtrl', 'DashboardCtrl', 'SignupCtrl', 'LoginCtrl', 'SubscriberCtrl', 'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'CrudDataService', 'MockDataService', , 'CoreService', 'AuthDataService']);

// Environments -----------------------------------------
app.run(function ($rootScope, $location, $window, CrudData, MockData, AuthToken, AuthWrapper) {

    // variables and api names ---------------------------------
    $rootScope.apis = {};
    $rootScope.menus = [];
    $rootScope.storage = null;
    $rootScope.loggedIn = AuthWrapper.isLoggedIn();
    $rootScope.apis.menus = '/api/getMenusByRoles';
    $rootScope.apis.createUser = '/api/createUser';
    $rootScope.apis.updateUser = '/api/updateUser';
    $rootScope.apis.updateLesson = '/api/updateLesson';
    $rootScope.apis.updateLevel = '/api/updateLevel';
    $rootScope.apis.deleteUser = '/api/deleteUser';
    $rootScope.apis.getUser = '/api/getUser';
    $rootScope.apis.getDepartments = '/api/getDepartments';
    $rootScope.apis.addLevel = '/api/addLevel';
    $rootScope.apis.addLesson = '/api/addLesson';
    $rootScope.apis.addDepartment = '/api/addDepartment';
    $rootScope.apis.updateDepartment = '/api/updateDepartment';
    $rootScope.apis.getCourses = '/api/getCourses';
    $rootScope.apis.getFirebaseConfig = '/api//getFirebaseConfig';
    $rootScope.apis.me = '/api/me';
    $rootScope.apis.token = '/api/token';
    $rootScope.apis.getLevelsByDepartmentId = '/api/getLevelsByDepartmentId';
    $rootScope.apis.getLessonsByDepartmentId = '/api/getLessonsByDepartmentId';
    $rootScope.apis.getLessonsByLevelIdAndVersion = '/api/getLessonsByLevelIdAndVersion';
    $rootScope.apis.getPaymentByUid = '/api/getPaymentsByUid';
    $rootScope.apis.getUserWithEmailAndPassword = '/api/getUserWithEmailAndPassword';
    $rootScope.apis.listAllUsers = '/api/listAllUsers';
    // ---------------------------------------------------------------------

    // firebase storage ----------------------------------------------------
    CrudData.service({}, $rootScope.apis.getFirebaseConfig, (response) => {
        if (response.data.status === '200') {
            firebase.initializeApp(response.data.config);
            $rootScope.storage = firebase.storage();
        }
    });
    // --------------------------------------------------------------------
    AuthWrapper.service({}, $rootScope.apis.me, (response) => {
        if (response.data.status === '200') {
            $rootScope.menus = response.data.user.menus;
            $rootScope.user = response.data.user;
        }
    });

    // ----------------------------------------------------------------
    // Change Route and Check Authorize --------------------------------
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var authenticated = next.$$route.authenticated;

        if ($rootScope.user === null) {
            AuthToken.setToken();
            $location.path('/login');
            $location.replace();
        } else {
            if ($rootScope.loggedIn) {
                if (!authenticated) {
                    $location.path('/dashboard');
                }
            } else {
                if (authenticated) {
                    $location.path('/login');
                }
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
            templateUrl: '../views/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            authenticated: true
        })
        .when('/package', {
            templateUrl: '../views/package.html',
            controller: 'PackageController',
            controllerAs: 'package',
            authenticated: true
        })
        .when('/lesson', {
            templateUrl: '../views/lesson.html',
            controller: 'LessonController',
            controllerAs: 'lesson',
            authenticated: true
        })
        .when('/level', {
            templateUrl: '../views/level.html',
            controller: 'LevelController',
            controllerAs: 'level',
            authenticated: true
        })
        .when('/department', {
            templateUrl: '../views/department.html',
            controller: 'DepartmentController',
            controllerAs: 'department',
            authenticated: true
        })
        .when('/course', {
            templateUrl: '../views/course.html',
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
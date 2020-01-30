var app = angular.module('app', ['ngRoute', 'TestCtrl', 'CandidateCtrl', 'ScheduleCtrl', 'LessonCtrl', 'PackageCtrl', 'LevelCtrl', 'DepartmentCtrl', 'CourseCtrl', 'DashboardCtrl', 'SignupCtrl', 'LoginCtrl', 'SubscriberCtrl', 'PublisherCtrl', 'ProfileCtrl', 'IndexCtrl', 'TokboxDataService', 'CrudDataService', 'MockDataService', , 'CoreService', 'AuthDataService']);

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
    $rootScope.apis.updatePackage = '/api/updatePackage';
    $rootScope.apis.updateLevel = '/api/updateLevel';
    $rootScope.apis.deleteUser = '/api/deleteUser';
    $rootScope.apis.getUser = '/api/getUser';
    $rootScope.apis.getDepartments = '/api/getDepartments';
    $rootScope.apis.addLevel = '/api/addLevel';
    $rootScope.apis.addPackage = '/api/addPackage';
    $rootScope.apis.updatePackage = '/api/updatePackage';
    $rootScope.apis.addLesson = '/api/addLesson';
    $rootScope.apis.addDepartment = '/api/addDepartment';
    $rootScope.apis.updateDepartment = '/api/updateDepartment';
    $rootScope.apis.getCourses = '/api/getCourses';
    $rootScope.apis.getFirebaseConfig = '/api//getFirebaseConfig';
    $rootScope.apis.me = '/api/me';
    $rootScope.apis.token = '/api/token';
    $rootScope.apis.getSchedulesByCourseId = '/api/getSchedulesByCourseId';
    $rootScope.apis.getPackageByDocumentId = '/api/getPackageByDocumentId';
    $rootScope.apis.getLevelsByDepartmentId = '/api/getLevelsByDepartmentId';
    $rootScope.apis.getPackagesByDepartmentId = '/api/getPackagesByDepartmentId';
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


    // ----------------------------------------------------------------
    // Change Route and Check Authorize --------------------------------
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var authenticated = next.$$route.authenticated;
        let token = AuthToken.getToken();
        if (authenticated) {
            if (token === null || token === undefined) {
                $location.path('/login');
            }
        } else {
            if (token !== null && token !== undefined) {
                AuthWrapper.service({}, $rootScope.apis.me, (response) => {
                    if (response.data.status === globe.config.status_409) {
                        AuthToken.setToken();
                        $rootScope.loggedIn = false;
                        $location.path('/login');
                    }
                });
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
        .when('/candidate', {
            templateUrl: '../views/candidate.html',
            controller: 'CandidateController',
            controllerAs: 'candidate',
            authenticated: true
        })
        .when('/package', {
            templateUrl: '../views/package.html',
            controller: 'PackageController',
            controllerAs: 'package',
            authenticated: true
        })
        .when('/schedule', {
            templateUrl: '../views/schedule.html',
            controller: 'ScheduleController',
            controllerAs: 'schedule',
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
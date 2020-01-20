var SignupCtrl = angular.module('SignupCtrl', []);

SignupCtrl.controller('SignupController', function ($timeout, $window, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;

    vm.signupData = {
        uid: '',
        photoURL: '',
        username: '',
        biography: '',
        phoneNumber: '',
        email: '',
        password: '',
        roles: ['p2p', 'group'],
        status: 'student',
        userSituation: true,
        displayName: '',
        registeredDate: new Date(),
        courses: [],
    }

    vm.doSignup = function () {
        AuthWrapper.service(vm.signupData, $rootScope.apis.createUser, (response) => {
            if (response.data.status === '200') {
                $rootScope.menus = response.data.user.menus;
                $window.location.href = "/dashboard";
            } else {
                if (response.data.code === 'auth/invalid-password') {
                    alert(response.data.message);
                }
            }
        });
    }


    vm.goPath = function () {
        $location.path('/login');
    }

});
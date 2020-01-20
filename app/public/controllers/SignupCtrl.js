var SignupCtrl = angular.module('SignupCtrl', []);

SignupCtrl.controller('SignupController', function ($timeout, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;

    vm.signupData = {
        uid: '',
        username: '',
        email: '',
        password: '',
        roles: ['p2p', 'group'],
        status: 'student',
        userSituation: true,
        nameSurname: '',
        profilePicPath: '',
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
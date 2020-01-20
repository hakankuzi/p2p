var LoginCtrl = angular.module('LoginCtrl', []);

LoginCtrl.controller('LoginController', function ($timeout, $scope, MockData, $window, $rootScope, $location, AuthWrapper) {
    var vm = this;
    vm.loginData = {
        email: '',
        password: '',
    }
    vm.doLogin = function () {
        AuthWrapper.service(vm.loginData, $rootScope.apis.getUserWithEmailAndPassword, (response) => {
            if (response.data.status === '200') {
                $window.location.href = "/dashboard";
            } else {
                if (response.data.code === 'auth/user-not-found') {
                    alert(response.data.message);
                } else if (response.data.code === 'wrong-password') {
                    alert(response.data.message);
                }
            }
        });
    }

    vm.doSignup = function () {
        $location.path('/signup');
    }
});
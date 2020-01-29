var SignupCtrl = angular.module('SignupCtrl', []);

SignupCtrl.controller('SignupController', function ($timeout, $window, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;

    vm.signupData = models.createSignupObj();
    console.log(vm.signupData);

    vm.doSignup = function () {
        console.log(vm.signupData);
        AuthWrapper.service(vm.signupData, $rootScope.apis.createUser, (response) => {
            console.log(response.data);
            if (response.data.status === globe.config.status_ok) {
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
var LoginCtrl = angular.module('LoginCtrl', []);

LoginCtrl.controller('LoginController', function ($timeout, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;
    vm.loginData = {
        email: "",
        password: "",
    }
    vm.doLogin = function () {
        AuthWrapper.service(vm.loginData, $rootScope.apis.getUserWithEmailAndPassword, (response) => {
            console.log(response);
            if (response.data.status === '200') {
                window.location.href = '/dashboard';
            }else{
                
            }
        });
    }

    vm.doSignup = function () {
        $location.path('/signup');
    }
});
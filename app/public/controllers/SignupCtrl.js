var SignupCtrl = angular.module('SignupCtrl', []);

SignupCtrl.controller('SignupController', function ($timeout, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;

    vm.signupData = {
        uid : '',
        username: '',
        email: '',
        password: '',
    }

    vm.doSignup = function () {
        AuthWrapper.service(vm.signupData, $rootScope.apis.createUser, (response) => {
            console.log(response.data.user);

        });
    }


    vm.goPath = function () {
        $location.path('/login');
    }

});
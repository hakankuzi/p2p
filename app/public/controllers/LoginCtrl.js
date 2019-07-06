var LoginCtrl = angular.module('LoginCtrl', []);

LoginCtrl.controller('LoginController', function ($timeout, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;
    vm.loginData = {
        Email: "",
        Password: "",
    }
    vm.doLogin = function () {

    }


});
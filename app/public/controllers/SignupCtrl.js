var SignupCtrl = angular.module('SignupCtrl', []);

SignupCtrl.controller('SignupController', function ($timeout, $scope, $rootScope, $location, AuthWrapper) {
    var vm = this;
   
    vm.signupData = {
        Email: "",
        Password: "",
    }



    vm.doSignup = function () {

    }

});
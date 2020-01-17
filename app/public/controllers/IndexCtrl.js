var IndexCtrl = angular.module('IndexCtrl', []);

IndexCtrl.controller('IndexController', function ($rootScope, $location) {
    var vm = this;
    vm.header = {};
    vm.header.brand = "Tokbox Sample";
    vm.header.title = "Management";


    vm.signupData = {
        email: '',
        password: ''
    }
    vm.loginData = {
        email: '',
        password: ''
    }
    console.log("test");


    vm.doSignup = function () {
        console.log(vm.signupData);
        $rootScope.auth.createUserWithEmailAndPassword(vm.signupData.email, vm.signupData.password).then(credential => {
            console.log(credential.user);

            
        }).catch((err) => {
            console.log(err.message);
        });

    }

    vm.doLogin = function () {
        console.log(vm.loginData);
    }




});
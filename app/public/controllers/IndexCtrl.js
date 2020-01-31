
var IndexCtrl = angular.module('IndexCtrl', []);

IndexCtrl.controller('IndexController', function ($scope, $rootScope, $window, MockData, AuthWrapper, CrudData, $location) {
    var vm = this;
    vm.header = {};
    vm.header.brand = "OWLEGE";
    vm.header.title = "Management";

    // api me ----------------------------------------------------
    AuthWrapper.service({}, $rootScope.apis.me, (response) => {
        if (response.data.status === '200') {
            $rootScope.menus = response.data.user.menus;
            $rootScope.user = response.data.user;
        } else {
            $location.path('/login');
        }
    });
    // -----------------------------------------------------------



    // -----------------------------------------------------------
    vm.change = function (menu) {
        if (menu === "/exit") {
            AuthWrapper.logout();
            $window.location.href = '/login';
        } else {
            $location.path(menu);
        }
    }
    // -----------------------------------------------------------




    // WORK ON .....
    /*
    MockData.service({ roles: ['admin'] }, $rootScope.apis.menus, (response) => {
        if (response.data.status === '200') {
            $rootScope.menus = response.data.list;
        }
    });
    */

    vm.signupData = {
        email: '',
        password: '',
    }

    vm.loginData = {
        email: '',
        password: ''
    }


    // https://github.com/firebase/functions-samples/blob/Node-8/authorized-https-endpoint/functions/index.js
    /*
    AuthWrapper.service({ amount: 1000 }, $rootScope.apis.listAllUsers, (response) => {
        console.log(response);
    });
    */

    vm.doSignup = function () {
        AuthWrapper.service(vm.signupData, $rootScope.apis.createUser, (response) => {
            console.log(response);

        });


        /*
        $rootScope.auth.createUserWithEmailAndPassword(vm.signupData.email, vm.signupData.password).then(credential => {
            console.log(credential.user);
        }).catch((err) => {
            console.log(err.message);
        });
        */


    }

    vm.doLogin = function () {
        console.log(vm.loginData);
        AuthWrapper.service(vm.loginData, $rootScope.apis.getUserWithEmailAndPassword, (response) => {
            //    console.log(response);
        });

        /*
        $rootScope.auth.signInWithEmailAndPassword(vm.loginData.email, vm.loginData.password).then(credential => {
            console.log(credential.user);
        }).catch(err => {
            console.log(err.message);
        });
        */


    }

    // -----------------------------------------------
    vm.logout = function () {
        $rootScope.auth.signOut().then(() => {
            console.log('user sign out')
        });
        // -------------------------------------------
    }
});
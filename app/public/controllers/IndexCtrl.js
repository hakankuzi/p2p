
var IndexCtrl = angular.module('IndexCtrl', []);

IndexCtrl.controller('IndexController', function ($rootScope, AuthWrapper, CrudData, $location) {
    var vm = this;
    vm.header = {};
    vm.header.brand = "Tokbox Sample";
    vm.header.title = "Management";

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
        $rootScope.auth.signInWithEmailAndPassword(vm.loginData.email, vm.loginData.password).then(credential => {
            console.log(credential.user);
        }).catch(err => {
            console.log(err.message);
        });
    }


    vm.logout = function () {
        $rootScope.auth.signOut().then(() => {
            console.log('user sign out')
        });
    }


    CrudData.getCourses({}, (response) => {
        if (response.data.status === '200') {
            console.log(response.data.list);
        } else {
            console.log(response.data.message);
        }
    });
});
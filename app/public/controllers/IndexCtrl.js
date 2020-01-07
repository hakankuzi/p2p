var IndexCtrl = angular.module('IndexCtrl', []);

IndexCtrl.controller('IndexController', function ($rootScope, $location, AuthUser) {
    var vm = this;
    vm.header = {};
    vm.header.brand = "Tokbox Sample";
    vm.header.title = "Management";

});
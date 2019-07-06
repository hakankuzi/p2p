var IndexCtrl = angular.module('IndexCtrl', []);

IndexCtrl.controller('IndexController', function ($rootScope, $location, AuthUser) {
    var vm = this;
    vm.header = {};
    vm.header.brand = "TimeToHelp";
    vm.header.title = "Management";

});
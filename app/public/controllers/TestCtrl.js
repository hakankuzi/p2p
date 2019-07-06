var TestCtrl = angular.module('TestCtrl', []);

TestCtrl.controller('TestController', function ($rootScope, $scope, P2P, $location) {
    var vm = this;

    P2P.openStream('mineside', (status) => {
        console.log(status);
    });


    vm.Connect = function () {

        let token = document.getElementById('othertoken').value;
        console.log(token);
        P2P.connectPeer(token);
    }

});
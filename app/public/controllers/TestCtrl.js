var TestCtrl = angular.module('TestCtrl', []);

TestCtrl.controller('TestController', function ($rootScope, $scope, P2P, $location) {
    var vm = this;


    /*
    P2P.openStream('mineside', (status) => {
        console.log(status);
    });
    */

    //P2P.test();


    vm.AddClient = function () {
        let role = document.getElementById('role').value;
        P2P.addClient(role)
    }

    vm.Connect = function () {
        // let token = document.getElementById('othertoken').value;
        //console.log(token);
        let role = document.getElementById('role').value;
        //   P2P.connectPeer(token);

        console.log(role);
        P2P.getStream((stream) => {

        });
        P2P.doLesson(role);
    }

});
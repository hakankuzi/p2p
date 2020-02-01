var P2PSessionCtrl = angular.module('P2PSessionCtrl', []);

P2PSessionCtrl.controller('P2PSessionController', function ($rootScope, $scope, CrudData, Core, $location) {
    var vm = this;

    vm.peerData = models.createP2PObj();
    vm.properties = models.createP2PPropertiesObj();

    getScheduleByUserId(response=>{


    });





    // -----------------------------------------------------------------
    vm.saveRating = function () {
        globe.hideModal('minemodal');
    }
    // -----------------------------------------------------------------


    // Web Element Check -----------------------------------------------
    vm.enter = function (event) {
        if (event.charCode == 13) //if enter is hot then call ValidateInputvalue().
            console.log(vm.properties.message);
    }
    // -----------------------------------------------------------------

    function getScheduleByUserId(callback) {
        if ($rootScope.user.status === globe.config.tutor) {
            let item = { parameter: 'userId', documentId: $rootScope.user.documentId };
            CrudData.service(item, $rootScope.apis.getSchedulesByUserId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.properties.schedules = response.data.list;

                    console.log(vm.properties.schedules);

                } else {
                    vm.properties.schedules = [];
                }
                callback(response);
            });
        }
    }



});
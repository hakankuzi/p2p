var DashboardCtrl = angular.module('DashboardCtrl', []);

DashboardCtrl.controller('DashboardController', function ($timeout, $scope, CrudData, $rootScope, $location, AuthWrapper) {
    var vm = this;

    vm.dashboardData = {
        totalPayment: '0.00£',
        payments: []
    }

    // ---------------------------------------------------
    vm.popPayments = function () {
        // Get Payment Detail --------------------------------
        CrudData.service({ uid: $rootScope.user.uid }, $rootScope.apis.getPaymentByUid, (response) => {
            if (response.data.status === '200') {
                vm.dashboardData.payments = response.data.list;
                let total = 0;
                angular.forEach(vm.dashboardData.payments, (o) => {
                    total = total + o.Price;
                });
                vm.dashboardData.totalPayment = total + '.00 £';
            } else {
                vm.dashboardData.totalPayment = '0.00 £';
                vm.dashboardData.payments = response.data.list;
            }
            $('#minemodal').modal('show');
        });
    }
    // ---------------------------------------------------
});
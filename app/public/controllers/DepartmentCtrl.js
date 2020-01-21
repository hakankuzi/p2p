var DepartmentCtrl = angular.module('DepartmentCtrl', []);

DepartmentCtrl.controller('DepartmentController', function ($rootScope, Core, CrudData, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.isSave = true;
    vm.departments = [];
    $scope.storage = null;
    vm.image = {};
    vm.departmentData = models.department;
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status === globe.config.status_ok) {
            vm.departments = response.data.list;
            console.log(vm.departments);
        }
    });

    // firebase storage ----------------------------------------------------
    CrudData.service({}, $rootScope.apis.getFirebaseConfig, (response) => {
        if (response.data.status === '200') {
            firebase.initializeApp(response.data.config);
            $scope.storage = firebase.storage();
        }
    });
    // --------------------------------------------------------------------
    vm.saveOrUpdateWithPhoto = function () {
        let methodName = null;
        if (vm.isSave) {
            methodName = $rootScope.apis.addDepartment;
        } else {
            methodName = $rootScope.apis.updateDepartment;
        }
        Core.saveOrUpdateWithPhoto($scope.storage, vm.departmentData, methodName, vm.image, vm.isSave, (response) => {
            console.log(response.status);
        });
    };
    // --------------------------------------------------------------------
    vm.changeSituation = function () {
        console.log('change situation')
    }
    // --------------------------------------------------------------------
    vm.choose = function (documentId) {
        let record = Core.findRecordById(vm.departments, documentId);
        if (record !== null) {
            vm.departmentData = record;
            vm.isSave = false;
        }
    }
    vm.cancel = function () {
        vm.departmentData = models.department;
        vm.isSave = true;
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.departmentData.photoURL, (response) => {
            vm.image = response;
        });
    };
    // --------------------------------------------------------------------

});
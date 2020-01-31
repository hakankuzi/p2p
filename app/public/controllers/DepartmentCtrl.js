var DepartmentCtrl = angular.module('DepartmentCtrl', []);

DepartmentCtrl.controller('DepartmentController', function ($rootScope, Core, CrudData, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.isSave = true;
    vm.picName = '';
    vm.departments = [];
    vm.image = {};
    vm.departmentData = models.createDepartmentObj();
    getDepartments();
    // --------------------------------------------------------------------
    vm.saveOrUpdateWithPhoto = function () {
        let methodName = null;
        if (vm.isSave) {
            methodName = $rootScope.apis.addDepartment;
        } else {
            methodName = $rootScope.apis.updateDepartment;
        }
        Core.saveOrUpdateWithPhoto($rootScope.storage, vm.departmentData, methodName, vm.image, vm.isSave, (response) => {
            if (response.status === globe.config.status_ok) {
                if (vm.isSave) {
                    alert('added');
                } else {
                    alert('updated');
                }
            }
            vm.departmentData = models.createDepartmentObj();
            getDepartments();
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
            vm.action = 'Update';
        }
    }
    vm.cancel = function () {
        vm.departmentData = models.createDepartmentObj();
        vm.isSave = true;
        vm.action = 'Save';
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.departmentData.photoURL, (response) => {
            vm.image = response;
            vm.picName = vm.image.item.name;

        });
    };
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    function getDepartments() {
        // Get Departments ----------------------------------------------------
        CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.departments = response.data.list;
            }
        });
    }
    // --------------------------------------------------------------------

});
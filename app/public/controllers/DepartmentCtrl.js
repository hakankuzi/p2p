var DepartmentCtrl = angular.module('DepartmentCtrl', []);

DepartmentCtrl.controller('DepartmentController', function ($rootScope, Core, CrudData, $scope, $location) {
    var vm = this;
    vm.departmentData = models.createDepartmentObj();
    vm.properties = models.createDepartmentPropertiesObj();

    getDepartments();
    // --------------------------------------------------------------------
    vm.saveOrUpdateWithPhoto = function () {
        let isNone = globe.isNone(vm.departmentData.photoURL);
        if (isNone) {
            alert('You have to choose picture for department !!!');
        } else {
            let methodName = null;
            if (vm.properties.isSave) {
                methodName = $rootScope.apis.addDepartment;
            } else {
                methodName = $rootScope.apis.updateDepartment;
            }
            Core.saveOrUpdateWithPhoto($rootScope.storage, vm.departmentData, methodName, vm.properties.image, vm.properties.isSave, (response) => {
                if (response.status === globe.config.status_ok) {
                    if (vm.properties.isSave) {
                        alert('added');
                    } else {
                        alert('updated');
                    }
                }
                vm.departmentData = models.createDepartmentObj();
                vm.properties = models.createDepartmentPropertiesObj();
                getDepartments();
            });
        }
    };
    // --------------------------------------------------------------------
    vm.changeSituation = function () {
        console.log('change situation')
    }
    // --------------------------------------------------------------------
    vm.choose = function (documentId) {
        let record = Core.findRecordById(vm.properties.departments, documentId);
        if (record !== null) {
            vm.departmentData = record;
            vm.properties.isSave = false;
            vm.properties.action = 'Update';
            vm.properties.selectedDepartment = true;
            vm.properties.photoURL = record.photoURL;
        }
    }
    vm.cancel = function () {
        vm.departmentData = models.createDepartmentObj();
        vm.properties.isSave = true;
        vm.properties.action = 'Save';
        vm.properties.selectedDepartment = false;
        vm.properties.photoURL = 'none';
    }
    // ------------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.departmentData.photoURL, (response) => {
            vm.properties.image = response;
            vm.properties.picName = vm.properties.image.item.name;
        });
    };
    // ------------------------------------------------------------------------
    function getDepartments() {
        // Get Departments ----------------------------------------------------
        CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.properties.departments = response.data.list;
            }
        });
    }
    // -------------------------------------------------------------------------

});
var LevelCtrl = angular.module('LevelCtrl', []);

LevelCtrl.controller('LevelController', function ($rootScope, Core, $scope, CrudData, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.levelData = models.createLevelObj();
    $scope.selectedLevel = false;
    vm.isDepartment = false;
    vm.isAmount = false;
    vm.isSave = true;
    vm.departments = [];
    vm.levels = [];

    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.departments = response.data.list;
        }
    });
    // -----------------------------------------------------------------
    vm.saveOrUpdate = function () {
        if (vm.isSave) {
            CrudData.service(vm.levelData, $rootScope.apis.addLevel, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.getLevelsByDepartmentId();

                }
            });
        } else {
            CrudData.service(vm.levelData, $rootScope.apis.updateLevel, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    alert(response.data.message);
                    vm.getLevelsByDepartmentId();
                }
            });
        }
    }

    vm.getLevelsByDepartmentId = function () {
        let item = { parameter: 'departmentId', documentId: vm.levelData.departmentId };
        CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.levels = response.data.list;
            } else {
                alert(response.data.message);
            }
            vm.hideModal();
        });
    }
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        vm.getLevelsByDepartmentId();
    }
    // -----------------------------------------------------------------
    vm.choose = function (item) {
        vm.levelData = {
            documentId: item.documentId,
            departmentId: item.departmentId,
            description: item.description,
            level: item.level,
            situation: item.situation,
            rootLevel: item.rootLevel,
            amount: item.amount,
            version: item.version,
            registeredDate: item.registeredDate
        }
        vm.isSave = false;
        vm.action = 'Update';
        $scope.selectedLevel = true;
    }
    // -----------------------------------------------------------------
    vm.cancel = function () {
        vm.levelData = models.createLevelObj();
        vm.isSave = true;
        vm.action = 'Save';
        $scope.selectedLevel = false;
    }
    // -----------------------------------------------------------------
    vm.popModal = function () {
        globe.popModal('minemodal');
    }

    vm.hideModal = function () {
        globe.hideModal('minemodal');
    }
    // -----------------------------------------------------------------
    vm.createNewVersion = function () {
        vm.levelData.levelId = vm.levelData.documentId;
        Core.createNewVersion(vm.levels, vm.levelData, $rootScope.apis.addLevel, (response) => {
            if (response.data.status === globe.config.status_ok) {
                let item = { parameter: 'departmentId', documentId: vm.levelData.departmentId };
                CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
                    if (response.data.status === globe.config.status_ok) {
                        vm.levels = response.data.list;
                    } else {
                        alert(response.data.message);
                    }
                    vm.hideModal();
                });
            } else {
                alert(response.data.message);
            }
        });
    }
    // -----------------------------------------------------------------
});
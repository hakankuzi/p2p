var LevelCtrl = angular.module('LevelCtrl', []);

LevelCtrl.controller('LevelController', function ($rootScope, Core, $scope, CrudData, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.levelData = models.level;
    $scope.selectedLevel = false;
    vm.isDepartment = false;
    vm.isAmount = false;
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
                    alert(response.data.message);
                }
            });
        } else {
            CrudData.service(vm.levelData, $rootScope.apis.updateLevel, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    alert(response.data.message);
                }
            });
        }
    }
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        let item = { parameter: 'departmentId', documentId: vm.levelData.departmentId };
        CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {

            if (response.data.status === globe.config.status_ok) {
                vm.levels = response.data.list;
            }
        });
    }
    // -----------------------------------------------------------------
    vm.change = function () {

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
        vm.levelData = models.level;
        vm.isSave = true;
        vm.action = 'Save';
        $scope.selectedLevel = false;
    }
    // -----------------------------------------------------------------
    vm.createNewVersion = function () {

    }
    // -----------------------------------------------------------------



});
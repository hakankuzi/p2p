var PackageCtrl = angular.module('PackageCtrl', []);

PackageCtrl.controller('PackageController', function ($scope, Core, $rootScope, CrudData, $location) {
    var vm = this;
    vm.packageData = models.package;
    vm.departments = [];
    vm.levels = [];
    vm.versions = [];
    vm.lessons = [];
    vm.isAdded = false;
    vm.isDuration = true;
    vm.isPrice = false;
    vm.isLevel = true;
    vm.isLesson = false;
    vm.isTopic = false;
    vm.action = 'Save';
    vm.tempList = [];
    vm.modalAction = 'Add Level';


    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.departments = response.data.list;
            vm.packageData.departmentId = 'none';
        }
    });
    // ------------------------------------------------------------------
    vm.changeLevel = function () {
        let isNone = globe.isNone(vm.packageData.levelId);
        if (!isNone) {
            vm.versions = [];
            angular.forEach(vm.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.packageData.levelId) {
                            vm.versions.push(item);
                        }
                    } else {
                        if (item.levelId === vm.packageData.levelId) {
                            vm.versions.push(item);
                        }
                    }
                });
            });
            vm.packageData.version = 'none';
        }
    }
    // ------------------------------------------------------------------
    vm.changeVersion = function () {
        let item = {
            parameterOneId: 'levelId', parameterOneValue: vm.packageData.levelId,
            parameterTwoId: 'version', parameterTwoValue: vm.packageData.version
        };
        CrudData.service(item, $rootScope.apis.getLessonsByLevelIdAndVersion, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.lessons = response.data.list;
                vm.isLesson = true;
                let total = Core.calculateDuration(vm.lessons);
                vm.packageData.duration = total;
            } else {
                vm.lessons = [];
                vm.isLesson = false;
                vm.packageData.duration = 0;
                alert(response.data.message);
            }
        });
    }
    // ------------------------------------------------------------------
    vm.addLevel = function () {
        let isNone = globe.isNone(vm.packageData.departmentId);
        if (isNone) {
            alert('Please choose department')
        } else {
            let item = { parameter: 'departmentId', documentId: vm.packageData.departmentId };
            CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.levels = Core.findHierarchy(response.data.list);
                    vm.packageData.duration = 0;
                    vm.packageData.price = 0;
                    vm.packageData.levelId = 'none';
                    vm.packageData.version = 'none';
                    vm.tempList = [];
                    vm.modalAction = 'Add Level';
                    vm.isDuration = true;
                    vm.isPrice = true;
                    vm.isLevel = true;
                    vm.isAdded = true;
                    vm.packageData.subPackages = globe.config.sub_package_level;
                    globe.popModal('minemodal');
                } else {
                    alert(response.data.message);
                }
            });
        }
    }
    // ------------------------------------------------------------------
    vm.addVideo = function () {
        console.log('add video');
    }
    // ------------------------------------------------------------------
    vm.addGroup = function () {
        vm.modalAction = 'Add Group';

        vm.isDuration = false;
        vm.isPrice = true;
        vm.isLevel = false;
        vm.isTopic = true;
        vm.packageData.packageType = globe.config.package_academy;
        vm.packageData.subPackages = globe.config.sub_package_group;
        vm.packageData.level = 'Group';
        vm.packageData.version = '-';
        globe.popModal('minemodal');
    }
    // ------------------------------------------------------------------
    vm.close = function () {
        vm.packageData.duration = 0;
        vm.packageData.price = 0;
        vm.packageData.version = 'none'
        vm.packageData.levelId = 'none';
        vm.isDuration = false;
        vm.isPrice = false;
        vm.isLevel = false;
        vm.isTopic = false;
        vm.packageData.subPackages = '';
        globe.hideModal('minemodal');
    }
    // ------------------------------------------------------------------
    vm.doAction = function () {
        vm.tempList.push(vm.packageData);
        globe.hideModal('minemodal');

        console.log(vm.tempList);

    }
    // ------------------------------------------------------------------
    vm.removeRow = function (index) {
        vm.tempList.splice(index, 1);
        let duration = 0;
        let price = 0;
        if (vm.tempList.length != 0) {
            angular.forEach(vm.tempList, (item) => {
                duration = duration + item.duration;
                price = price + item.price;
            });
            vm.isAdded = true;
        } else {
            vm.isAdded = false;
        }
    }
    // ------------------------------------------------------------------
});
var PackageCtrl = angular.module('PackageCtrl', []);

PackageCtrl.controller('PackageController', function ($scope, Core, $rootScope, CrudData, $location) {
    var vm = this;
    vm.packageData = models.package;
    vm.properties = models.package.properties;

    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.properties.departments = response.data.list;
            vm.packageData.departmentId = 'none';
        }
    });
    // ------------------------------------------------------------------  
    vm.changeLevel = function () {
        let isNone = globe.isNone(vm.packageData.levelId);
        if (!isNone) {
            vm.properties.versions = [];
            angular.forEach(vm.properties.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.packageData.levelId) {
                            vm.properties.versions.push(item);
                        }
                    } else {
                        if (item.levelId === vm.packageData.levelId) {
                            vm.properties.versions.push(item);
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
                vm.properties.lessons = response.data.list;
                vm.properties.isLesson = true;
                let total = Core.calculateDuration(vm.properties.lessons);
                vm.packageData.duration = total;
            } else {
                vm.properties.lessons = [];
                vm.properties.isLesson = false;
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
            vm.getLevelsByDepartmentsId(response => {
                if (response === globe.config.status_ok) {
                    vm.packageData.duration = 0;
                    vm.packageData.price = 0;
                    vm.packageData.levelId = 'none';
                    vm.packageData.version = 'none';
                    vm.packageData.subPackages = globe.config.sub_package_level;
                    vm.properties.lessons = [];
                    vm.properties.modalAction = 'Add Level';
                    vm.properties.isDuration = true;
                    vm.properties.isPrice = false;
                    vm.properties.isLevel = true;
                    vm.properties.isAdded = false;
                    vm.properties.isTable = true;
                    globe.popModal('minemodal');
                } else {
                    alert(response.data.message);
                }
            });
        }
    }
    // ------------------------------------------------------------------
    vm.addVideo = function () {
        let isNone = globe.isNone(vm.packageData.departmentId);
        if (isNone) {
            alert('Please choose department')
        } else {
            vm.getLevelsByDepartmentsId(response => {
                if (response === globe.config.status_ok) {
                    vm.packageData.subPackages = globe.config.sub_package_video;
                    vm.packageData.duration = 0;
                    vm.packageData.price = 0;
                    vm.packageData.levelId = 'none';
                    vm.packageData.version = 'none';
                    vm.properties.modalAction = 'Add Video';
                    vm.properties.isTopic = true;
                    vm.properties.isTable = true;
                    vm.properties.isDuration = true;
                    vm.properties.isLevel = true;
                    vm.properties.lessons = [];
                    globe.popModal('minemodal');
                }
            });
        }
    }
    // ------------------------------------------------------------------
    vm.addGroup = function () {
        let isNone = globe.isNone(vm.packageData.departmentId);
        if (isNone) {
            alert('Please choose department')
        } else {
            vm.properties.modalAction = 'Add Group';
            vm.properties.isDuration = false;
            vm.properties.isPrice = false;
            vm.properties.isLevel = false;
            vm.properties.isTopic = true;
            vm.properties.lessons = [];
            vm.properties.isTable = false;
            vm.packageData.duration = 0;
            vm.packageData.price = 0;
            vm.packageData.packageType = globe.config.package_academy;
            vm.packageData.subPackages = globe.config.sub_package_group;
            vm.packageData.level = globe.config.sub_package_group;
            vm.packageData.version = '-';
            globe.popModal('minemodal');
        }
    }
    // ------------------------------------------------------------------
    vm.close = function () {
        globe.hideModal('minemodal');
    }
    // ------------------------------------------------------------------
    vm.doAction = function () {
        let temp = {
            departmentId: vm.packageData.departmentId,
            levelId: vm.packageData.levelId,
            documentId: vm.packageData.documentId,
            situation: vm.packageData.situation,
            packageType: vm.packageData.packageType,
            subPackages: vm.packageData.subPackages,
            registeredDate: vm.packageData.registeredDate,
            special: vm.packageData.special,
            duration: vm.packageData.duration,
            version: vm.packageData.version,
            price: vm.packageData.price,
            agrement: vm.packageData.agrement,
            description: vm.packageData.description,
            isFree: vm.packageData.isFree
        }
        vm.properties.tempList.push(temp);
        if (vm.properties.tempList.length !== 0) {
            vm.properties.price = Core.calculatePrice(vm.properties.tempList);
            vm.properties.isAdded = true;
        }
        console.log(vm.properties.tempList);
        globe.hideModal('minemodal');
    }
    // ------------------------------------------------------------------
    vm.removeRow = function (index) {
        vm.properties.tempList.splice(index, 1);
        if (vm.properties.tempList.length != 0) {
            vm.properties.price = Core.calculatePrice(vm.properties.tempList);
            vm.properties.isAdded = true;
        } else {
            vm.properties.isAdded = false;
        }
    }
    // ------------------------------------------------------------------
    vm.getLevelsByDepartmentsId = function (callback) {
        let item = { parameter: 'departmentId', documentId: vm.packageData.departmentId };
        CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.properties.levels = Core.findHierarchy(response.data.list);
                callback(globe.config.status_ok);
            } else {
                alert(response.data.message);
            }
        });

    }
    // ------------------------------------------------------------------
});
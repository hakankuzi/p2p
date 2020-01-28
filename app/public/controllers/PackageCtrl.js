var PackageCtrl = angular.module('PackageCtrl', []);

PackageCtrl.controller('PackageController', function ($scope, Core, $rootScope, CrudData, $location) {
    var vm = this;
    vm.packageData = models.createPackageObj();
    vm.properties = models.createPackageProperties();
    
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
                            vm.packageData.amount = item.amount;
                        }
                    } else {
                        if (item.levelId === vm.packageData.levelId) {
                            vm.properties.versions.push(item);
                            vm.packageData.amount = item.amount;
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
                    vm.packageData.amount = 0;
                    vm.packageData.levelId = 'none';
                    vm.packageData.version = 'none';
                    vm.packageData.subPackage = globe.config.sub_package_level;
                    vm.properties.lessons = [];
                    vm.properties.modalAction = 'Add Level';
                    vm.properties.isDuration = true;
                    vm.properties.isPrice = false;
                    vm.properties.isTopic = false;
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
                    vm.packageData.subPackage = globe.config.sub_package_video;
                    vm.packageData.duration = 0;
                    vm.packageData.price = 0;
                    vm.packageData.amount = 0;
                    vm.packageData.topic = '';
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
            vm.packageData.topic = '';
            vm.packageData.packageType = globe.config.package_academy;
            vm.packageData.subPackage = globe.config.sub_package_group;
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
        let isValidate = false;
        let isExist = false;
        let list = [];
        if (vm.packageData.subPackage === globe.config.sub_package_level) {
            list.push(vm.packageData.levelId);
            list.push(vm.packageData.version);
            list.push(vm.packageData.price);
            list.push(vm.packageData.duration);
            isValidate = globe.isValidate(list);
            if (vm.properties.tempList.length !== 0) {
                angular.forEach(vm.properties.tempList, (record) => {
                    if (record.levelId === vm.packageData.levelId && record.subPackage === vm.packageData.subPackage) {
                        isExist = true;
                    }
                });
            }
        } else if (vm.packageData.subPackage === globe.config.sub_package_group) {
            list.push(vm.packageData.topic);
            list.push(vm.packageData.price);
            list.push(vm.packageData.duration);
            isValidate = globe.isValidate(list);
            if (vm.properties.tempList.length !== 0) {
                angular.forEach(vm.properties.tempList, (record) => {
                    if (record.topic === vm.packageData.topic && record.subPackage === vm.packageData.subPackage) {
                        isExist = true;
                    }
                });
            }

        } else if (vm.packageData.subPackage === globe.config.sub_package_video) {
            list.push(vm.packageData.topic);
            list.push(vm.packageData.levelId);
            list.push(vm.packageData.price);
            list.push(vm.packageData.version);
            list.push(vm.packageData.duration);
            isValidate = globe.isValidate(list);
            if (vm.properties.tempList.length !== 0) {
                angular.forEach(vm.properties.tempList, (record) => {
                    if (record.levelId === vm.packageData.levelId && record.subPackage === vm.packageData.subPackage) {
                        isExist = true;
                    }
                });
            }
        }
        if (!isValidate) {
            alert('Please check all inputs !!!');
        } else if (isExist) {
            alert('You are adding exist feature !!!')
        } else {
            let temp = {
                departmentId: vm.packageData.departmentId,
                topic: vm.packageData.topic,
                levelId: vm.packageData.levelId,
                documentId: vm.packageData.documentId,
                situation: vm.packageData.situation,
                packageType: vm.packageData.packageType,
                subPackage: vm.packageData.subPackage,
                registeredDate: vm.packageData.registeredDate,
                special: vm.packageData.special,
                amount: vm.packageData.amount,
                duration: vm.packageData.duration,
                version: vm.packageData.version,
                price: vm.packageData.price,
                agrement: vm.packageData.agrement,
                description: vm.packageData.description,
                isFree: vm.packageData.isFree
            }
            vm.properties.tempList.push(temp);
            vm.properties.price = Core.calculatePrice(vm.properties.tempList);
            vm.properties.duration = Core.calculateDuration(vm.properties.tempList);
            vm.properties.isAdded = true;
            globe.hideModal('minemodal');
        }
    }


    // ------------------------------------------------------------------
    vm.removeRow = function (index) {
        vm.properties.tempList.splice(index, 1);
        if (vm.properties.tempList.length != 0) {
            vm.properties.price = Core.calculatePrice(vm.properties.tempList);
            vm.properties.duration = Core.calculateDuration(vm.properties.tempList);
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
    // ------------------------------------------------------------------  
    vm.saveOrUpdate = function () {
        let isNone = globe.isNone(vm.packageData.departmentId);
        if (isNone) {
            alert('You have to select department')
        } else {
            let item = {};
            item.levels = [];
            item.groups = [];
            item.videos = [];
            item.subPackages = [];
            item.agrement = vm.packageData.agrement;
            item.departmentId = vm.packageData.departmentId;
            item.description = vm.packageData.description;
            item.isFree = vm.packageData.isFree;
            item.special = vm.packageData.special;
            item.situation = vm.packageData.situation;
            item.package = vm.packageData.package;
            item.registeredDate = vm.packageData.registeredDate;
            item.price = vm.properties.price;
            item.packageType = vm.packageData.packageType;
            item.duration = vm.properties.duration;

            // check and add subPackages --------------------------------------------------
            angular.forEach(vm.properties.tempList, (record) => {
                if (record.subPackage === globe.config.sub_package_level) {
                    item.levels.push({ levelId: record.levelId, amount: record.amount, version: record.version });
                } else if (record.subPackage === globe.config.sub_package_group) {
                    item.groups.push({ topic: record.topic, duration: record.duration });
                } else if (record.subPackage === globe.config.sub_package_video) {
                    item.videos.push({ levelId: record.levelId, amount: record.amount, topic: record.topic, version: record.version });
                }
                if (!item.subPackages.includes(record.subPackage)) {
                    item.subPackages.push(record.subPackage);
                }
            });
            // ----------------------------------------------------------------------------

            // CREATE OR UPDATE
            // ----------------------------------------------------------------------------
            if (vm.properties.isSave) {
                CrudData.service(item, $rootScope.apis.addPackage, (response) => {
                    if (response.data.status === globe.config.status_ok) {
                        getPackagesByDepartmentId(response => {
                            if (response === globe.config.status_ok) {
                                vm.packageData = models.createPackageObj();
                                vm.properties = models.createPackageProperties();
                                console.log(vm.properties);
                                console.log(vm.packageData);
                            } else {
                                alert('getting problem');
                            }
                        });
                    }
                });
            } else {
                // update progressing .....
            }
        }
    }
    // ----------------------------------------------------------------------------
    function getPackagesByDepartmentId(callback) {
        let item = { parameter: 'departmentId', documentId: vm.packageData.departmentId };
        CrudData.service(item, $rootScope.apis.getPackagesByDepartmentId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.properties.packages = response.data.list;
                callback(globe.config.status_ok);
            }
        });
    }
    // ----------------------------------------------------------------------------
});
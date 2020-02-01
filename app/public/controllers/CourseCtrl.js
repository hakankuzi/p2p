var CourseCtrl = angular.module('CourseCtrl', []);

CourseCtrl.controller('CourseController', function ($rootScope, $scope, Core, CrudData, $location) {
    var vm = this;
    vm.courseData = models.createCourseObj();
    vm.properties = models.createCoursePropertiesObj();
    vm.courseData.userId = $rootScope.user.documentId;
    // --------------------------------------------------------------------
    vm.cancel = function () {
        unFillByChangingDepartment(null, null);
        vm.courseData.departmentId = 'none';
        vm.courseData.photoURL = '';
        vm.properties.coursePicName = '';
        vm.properties.isDepartment = false;
    }
    // --------------------------------------------------------------------
    vm.chooseCourse = function (item) {
        vm.courseData = item;
        vm.properties.selectedCourse = true;
        vm.properties.action = 'UPDATE COURSE';
        vm.properties.isSave = false;
        if (vm.courseData.packageType === globe.config.package_p2p || vm.courseData.packageType === globe.config.package_group) {
            vm.properties.isPrice = false;
            vm.properties.isDuration = false;
            vm.properties.isCourse = false;
            vm.properties.isPackage = true;
            vm.properties.isDepartment = true;
        } else {
            vm.properties.isPrice = true;
            vm.properties.isDuration = true;
            vm.properties.isCourse = false;
            vm.properties.isPackage = true;
            vm.properties.isDepartment = true;
        }
    }
    // --------------------------------------------------------------------
    vm.saveOrUpdate = function () {
        let isValidate = isValidateRequiredVariables();
        if (isValidate) {
            if (vm.properties.isSave && !vm.properties.selectedCourse) {
                let isExistGroup = globe.isNone(vm.properties.package.groups);
                let isExistLevel = globe.isNone(vm.properties.package.levels);
                let isExistVideo = globe.isNone(vm.properties.package.videos);

                // exist Level -----------
                if (!isExistLevel) {
                    vm.courseData.levels = vm.properties.package.levels;
                    if (!vm.courseData.subPackages.includes(globe.config.sub_package_level)) {
                        vm.courseData.subPackages.push(globe.config.sub_package_level);
                    }
                } else {
                    vm.courseData.levels = [];
                }
                // -----------------------
                // exist gorup -----------
                if (!isExistGroup) {
                    vm.courseData.groups = vm.properties.package.groups;
                    if (!vm.courseData.subPackages.includes(globe.config.sub_package_group)) {
                        vm.courseData.subPackages.push(globe.config.sub_package_group);
                    }
                } else {
                    vm.courseData.groups = [];
                }
                // exist videos -----------
                if (!isExistVideo) {
                    vm.courseData.videos = vm.properties.package.videos;
                    if (!vm.courseData.subPackages.includes(globe.config.sub_package_video)) {
                        vm.courseData.subPackages.push(globe.config.sub_package_video);
                    }
                } else {
                    vm.courseData.videos = [];
                }
                let methodName = $rootScope.apis.addCourse;
                Core.saveOrUpdateWithPhoto($rootScope.storage, vm.courseData, methodName, vm.properties.image, vm.properties.isSave, (response) => {
                    getCoursesByDepartmentId();
                    unFillByChangingDepartment();
                    alert('added');
                });
            } else {
                let methodName = $rootScope.apis.updateCourse;
                Core.saveOrUpdateWithPhoto($rootScope.storage, vm.courseData, methodName, vm.properties.image, vm.properties.isSave, (response) => {
                    if (response.status === globe.config.status_ok) {
                        getCoursesByDepartmentId();
                        alert('updated');
                    }
                });
            }
        } else {
            alert('Please fill all required inputs !!!');
        }
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.courseData.photoURL, (response) => {
            vm.properties.image = response
            console.log(vm.properties.image);
            if (vm.properties.image.status === globe.config.status_ok) {
                vm.courseData.photoURL = vm.properties.image.item.path;
                vm.properties.coursePicName = vm.properties.image.item.name;
                $scope.$apply();
            } else {
                vm.courseData.photoURL = '';
                vm.properties.coursePicName = '';
                vm.properties.image = {};
            }
        });
    };
    // --------------------------------------------------------------------
    getDepartments(response => {
        if (response.data.status === globe.config.status_ok) {
            vm.properties.departments = response.data.list;
        } else {
            vm.properties.departments = [];
        }
    });
    // --------------------------------------------------------------------
    function getCoursesByDepartmentId() {
        CrudData.service({ parameter: 'departmentId', documentId: vm.courseData.departmentId }, $rootScope.apis.getCoursesByDepartmentId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                // temporary solution ----------------------------------------
                let list = [];
                angular.forEach(response.data.list, (record) => {
                    if (record.packageType !== globe.config.package_academy) {
                        list.push(record);
                    }
                });
                // -----------------------------------------------------------
                vm.properties.courses = list;
            } else {
                vm.properties.courses = [];
            }
        });
    }
    // --------------------------------------------------------------------
    function getDepartments(callback) {
        CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
            if (response.data.status = globe.config.status_ok) {
                callback(response);
            }
        });
    }
    // --------------------------------------------------------------------
    vm.changeDepartment = function () {
        let isNone = globe.isNone(vm.courseData.departmentId);
        if (!isNone) {
            CrudData.service({ parameter: 'departmentId', documentId: vm.courseData.departmentId }, $rootScope.apis.getPackagesByDepartmentId, (response) => {

                // temporary solution take out academy package 
                let list = [];
                angular.forEach(response.data.list, (record) => {
                    if (record.packageType !== globe.config.package_academy) {
                        list.push(record);
                    }
                });
                unFillByChangingDepartment(list, response.data.status);
                getCoursesByDepartmentId();
            });
        } else {
            unFillByChangingDepartment(null, null);
            unFillByChangingDepartment();
        }
    }
    // --------------------------------------------------------------------
    vm.changePackage = function () {
        let isNone = globe.isNone(vm.courseData.packageId);
        if (!isNone) {
            if (vm.courseData.packageId === 'p2p_in' || vm.courseData.packageId === 'group_in') {
                vm.properties.isCourse = false;
                vm.properties.isPrice = false;
                vm.properties.isDuration = false;
                vm.courseData.duration = 0;
                vm.courseData.price = 0;
                vm.courseData.levels = [];
                vm.courseData.groups = [];
                vm.courseData.videos = [];
                vm.courseData.subPackages = [];
                if (vm.courseData.packageId === 'p2p_in') {
                    vm.courseData.packageType = globe.config.package_p2p;
                } else {
                    vm.courseData.packageType = globe.config.package_group;
                }
                vm.properties.package = Core.findRecordById(vm.properties.packages, vm.courseData.packageId);
            } else {
                vm.properties.isCourse = false;
                vm.properties.isPrice = true;
                vm.properties.isDuration = true;
                vm.courseData.packageType = globe.config.package_academy;
                vm.properties.package = Core.findRecordById(vm.properties.packages, vm.courseData.packageId);
                vm.courseData.duration = vm.properties.package.duration;
                vm.courseData.price = vm.properties.package.price;
            }
        } else {
            unFillByChangingPackage()
        }
    }
    // VALIDATIONS --------------------------------------------------------
    // --------------------------------------------------------------------
    function unFillByChangingDepartment(packages, status) {

        vm.courseData.levels = [];
        vm.courseData.groups = [];
        vm.courseData.videos = [];
        vm.courseData.subPackages = [];
        vm.courseData.packageId = 'none';
        vm.courseData.course = '';
        vm.courseData.packageType = 'none';
        vm.courseData.duration = 0;
        vm.courseData.price = 0;
        vm.courseData.userId = $rootScope.user.documentId;
        vm.properties.isPrice = true;
        vm.properties.isDuration = true;
        vm.properties.isCourse = true;
        vm.properties.action = 'ADD COURSE';
        vm.properties.selectedCourse = false;
        vm.properties.isSave = true;
        vm.properties.visible = false;
        vm.properties.courses = [];
        vm.properties.package = {};
        vm.properties.isSave = true;
        vm.properties.packages = [];
        if (packages === null || status === null || packages === undefined) {
            vm.courseData.packageId = 'none';
            vm.properties.packages.push(globe.defaultP2P);
            vm.properties.packages.push(globe.defaultGROUP);
        } else {
            vm.properties.packages = packages;
            vm.properties.packages.push(globe.defaultP2P);
            vm.properties.packages.push(globe.defaultGROUP);
        }
        if (status === globe.config.status_ok) {
            vm.properties.isPackage = false;
        } else {
            vm.properties.isPackage = false;
        }
    }
    // --------------------------------------------------------------------
    function unFillByChangingPackage() {
        vm.properties.isCourse = true;
        vm.properties.isPrice = true;
        vm.properties.isDuration = true;
        vm.courseData.duration = 0;
        vm.courseData.price = 0;
        vm.courseData.levels = [];
        vm.courseData.groups = [];
        vm.courseData.videos = [];
        vm.courseData.subPackages = [];
        vm.courseData.packageType = 'none';
        vm.properties.package = {};
    }
    // --------------------------------------------------------------------
    function isValidateRequiredVariables() {
        let list = [];
        list.push(vm.courseData.departmentId);
        list.push(vm.courseData.packageId);
        list.push(vm.courseData.course);
        list.push(vm.courseData.price);
        list.push(vm.courseData.duration);
        list.push(vm.courseData.photoURL);
        return globe.isValidate(list);
    }
});
var CourseCtrl = angular.module('CourseCtrl', []);

CourseCtrl.controller('CourseController', function ($rootScope, $scope, Core, CrudData, $location) {
    var vm = this;
    vm.courseData = models.createCourseObj();
    vm.properties = models.createCoursePropertiesObj();
    vm.courseData.userId = $rootScope.user.documentId;

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
                // ---------------------
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

                delete vm.courseData.properties;
                console.log(vm.courseData);

            }

        } else {
            alert('Please fill all required inputs !!!');
        }
    }


    // --------------------------------------------------------------------
    getDepartments(response => {
        if (response.data.status === globe.config.status_ok) {
            vm.properties.departments = response.data.list;
        } else {
            vm.properties.departments = [];
        }
    });
    // --------------------------------------------------------------------
    vm.changeDepartment = function () {
        let isNone = globe.isNone(vm.courseData.departmentId);
        if (!isNone) {
            CrudData.service({ parameter: 'departmentId', documentId: vm.courseData.departmentId }, $rootScope.apis.getPackagesByDepartmentId, (response) => {
                unFillByChangingDepartment(response.data.list, response.data.status);
            });
        } else {
            unFillByChangingDepartment(null, null);
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
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.courseData.photoURL, (response) => {
            vm.properties.image = response
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
    function getDepartments(callback) {
        CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
            if (response.data.status = globe.config.status_ok) {
                callback(response);
            }
        });
    }
    // --------------------------------------------------------------------
    function unFillByChangingDepartment(packages, status) {

        if (packages === null || status === null) {

        } else {
            vm.properties.packages = packages;
            vm.properties.packages.push(globe.defaultP2P);
            vm.properties.packages.push(globe.defaultGROUP);
            vm.courseData.levels = [];
            vm.courseData.groups = [];
            vm.courseData.videos = [];
            vm.courseData.subPackages = [];
            vm.courseData.packageType = 'none';
            vm.courseData.packageId = 'none';

            if (status === globe.config.status_ok) {
                vm.properties.isPackage = false;
            } else {
                vm.properties.isPackage = true;
                alert(response.data.message);
            }
        }
    }
    // --------------------------------------------------------------------
    function unFillByChangingPackage() {

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
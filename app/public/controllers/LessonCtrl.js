var LessonCtrl = angular.module('LessonCtrl', []);

LessonCtrl.controller('LessonController', function ($rootScope, CrudData, Core, $scope, $location) {
    var vm = this;
    vm.lessonData = models.createLessonObj();
    vm.properties = models.createLessonPropertiesObj();

    getDepartments();
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        let isNone = globe.isNone(vm.lessonData.departmentId);
        if (!isNone) {
            let item = { parameter: 'departmentId', documentId: vm.lessonData.departmentId };
            CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.properties.levels = Core.findHierarchy(response.data.list);
                    vm.lessonData.levelId = 'none';
                }
            });
        }
    }
    // -----------------------------------------------------------------
    vm.changeLevel = function () {
        let isNone = globe.isNone(vm.lessonData.levelId);
        if (!isNone) {
            vm.properties.versions = [];
            angular.forEach(vm.properties.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.lessonData.levelId) {
                            vm.properties.versions.push(item);
                        }
                    } else {
                        if (item.levelId === vm.lessonData.levelId) {
                            vm.properties.versions.push(item);
                        }
                    }
                });
            });
            vm.lessonData.version = 'none';
        }
    }
    // -----------------------------------------------------------------
    vm.changeVersion = function () {
        let isNone = globe.isNone(vm.lessonData.version);
        if (!isNone) {
            vm.properties.numbers = [];
            angular.forEach(vm.properties.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.lessonData.levelId && item.version === vm.lessonData.version) {
                            for (let i = 0; i < item.amount; i++) {
                                vm.properties.numbers.push({ no: i });
                            }
                        }
                    } else {
                        if (item.levelId === vm.lessonData.levelId && item.version === vm.lessonData.version) {
                            for (let i = 0; i < item.amount; i++) {
                                vm.properties.numbers.push({ no: i });
                            }
                        }
                    }
                });
            });
            vm.lessonData.no = 'none';
            getLessonsByLevelIdAndVersion();
        }
    }
    // -----------------------------------------------------------------
    vm.saveOrUpdate = function () {

        console.log(vm.properties.isSave);

        if (vm.properties.isSave) {

            let isExist = false;
            angular.forEach(vm.properties.lessons, (record) => {
                if (record.no === vm.lessonData.no) {
                    isExist = true
                }
            });
            console.log(isExist)
            if (isExist) {
                alert('You have already saved that lesson !!!');
            } else {

                console.log(vm.lessonData);

                CrudData.service(vm.lessonData, $rootScope.apis.addLesson, (response) => {
                    if (response.data.status === globe.config.status_ok) {
                        getLessonsByLevelIdAndVersion();
                    }
                });
            }
        } else {
            CrudData.service(vm.lessonData, $rootScope.apis.updateLesson, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    alert(response.data.message);
                    getLessonsByLevelIdAndVersion();
                }
            });
        }
    }
    // -----------------------------------------------------------------
    vm.comboChoose = function (item) {
        vm.lessonData = item;
        vm.properties.selectedLesson = true;
        vm.properties.action = 'Update';
        vm.properties.isSave = false;
    }
    // -----------------------------------------------------------------
    vm.cancel = function () {
        vm.lessonData = models.createLessonObj();
        vm.properties = models.createLessonPropertiesObj();
        getDepartments();
    }
    // -----------------------------------------------------------------
    function getLessonsByLevelIdAndVersion() {
        let item = {
            parameterOneId: 'levelId', parameterOneValue: vm.lessonData.levelId,
            parameterTwoId: 'version', parameterTwoValue: vm.lessonData.version
        };
        CrudData.service(item, $rootScope.apis.getLessonsByLevelIdAndVersion, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.properties.lessons = response.data.list;
            } else {
                vm.properties.lessons = [];
                //alert(response.data.message);
            }
        });
    }
    // -----------------------------------------------------------------

    function getDepartments() {
        // get Departments --------------------------------------------------
        CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
            if (response.data.status = globe.config.status_ok) {
                vm.properties.departments = response.data.list;
                vm.lessonData.departmentId = 'none';
            }
        });
    }
});
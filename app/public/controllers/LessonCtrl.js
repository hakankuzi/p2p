var LessonCtrl = angular.module('LessonCtrl', []);

LessonCtrl.controller('LessonController', function ($rootScope, CrudData, Core, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.isSave = true;
    vm.lessonData = models.lesson;
    vm.departments = [];
    vm.levels = [];
    vm.versions = [];
    vm.lessons = [];
    vm.selectedLesson = false;

    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.departments = response.data.list;
            vm.lessonData.departmentId = 'none';
        }
    });
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        let isNone = globe.isNone(vm.lessonData.departmentId);
        if (!isNone) {
            let item = { parameter: 'departmentId', documentId: vm.lessonData.departmentId };
            CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.levels = Core.findHierarchy(response.data.list);
                    vm.lessonData.levelId = 'none';
                }
            });
        }
    }
    // -----------------------------------------------------------------
    vm.changeLevel = function () {
        let isNone = globe.isNone(vm.lessonData.levelId);
        if (!isNone) {
            vm.versions = [];
            angular.forEach(vm.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.lessonData.levelId) {
                            vm.versions.push(item);
                        }
                    } else {
                        if (item.levelId === vm.lessonData.levelId) {
                            vm.versions.push(item);
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
            vm.numbers = [];
            angular.forEach(vm.levels, (record) => {
                angular.forEach(record.levels, (item) => {
                    if (item.rootLevel) {
                        if (item.documentId === vm.lessonData.levelId && item.version === vm.lessonData.version) {
                            for (let i = 0; i < item.amount; i++) {
                                vm.numbers.push({ no: i });
                            }
                        }
                    } else {
                        if (item.levelId === vm.lessonData.levelId && item.version === vm.lessonData.version) {
                            for (let i = 0; i < item.amount; i++) {
                                vm.numbers.push({ no: i });
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
        if (vm.isSave) {
            let isExist = false;
            angular.forEach(vm.lessons, (record) => {
                if (record.no === vm.lessonData.no) {
                    isExist = true
                }
            });
            if (isExist) {
                alert('You have already saved that lesson !!!');
            } else {
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
        vm.selectedLesson = true;
        vm.action = 'Update';
        vm.isSave = false;
    }
    // -----------------------------------------------------------------
    vm.cancel = function () {
        vm.lessonData = models.lesson;
        vm.selectedLesson = false;
        vm.action = 'Save';
        vm.isSave = true;
    }
    // -----------------------------------------------------------------
    function getLessonsByLevelIdAndVersion() {
        let item = {
            parameterOneId: 'levelId', parameterOneValue: vm.lessonData.levelId,
            parameterTwoId: 'version', parameterTwoValue: vm.lessonData.version
        };
        CrudData.service(item, $rootScope.apis.getLessonsByLevelIdAndVersion, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.lessons = response.data.list;
            } else {
                vm.lessons = [];
                alert(response.data.message);
            }
        });
    }
    // -----------------------------------------------------------------
});
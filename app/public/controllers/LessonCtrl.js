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
                if (record.root.documentId === vm.lessonData.levelId) {
                    vm.versions.push(record.root);
                    angular.forEach(record.levels, (level) => {
                        vm.versions.push(level);
                    });
                }
            });
        }

        /*
        let item = { parameter: 'levelId', documentId: vm.lessonData.levelId };
        CrudData.service(item, $rootScope.apis.getLessonsByLevelId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.lessons = response.data.list;
            } else {
                vm.lessons = [];
                alert(response.data.message);
            }
        });
        */
    }

    // -----------------------------------------------------------------
    vm.changeVersion = function () {
        let isNone = globe.isNone(vm.lessonData.version);
        if (!isNone) {
            vm.versions = [];
            angular.forEach(vm.levels, (record) => {
                if (vm.lessonData.levelId === record.documentId) {
                    for (let i = 0; i < record.amount; i++) {
                        vm.numbers.push({ no: i });
                    }
                }
            });
        }
    }
    // -----------------------------------------------------------------
    vm.saveOrUpdate = function () {
        if (vm.isSave) {
            let item = {
                rootLevel: true,
                departmentId: vm.lessonData.departmentId,
                levelId: vm.lessonData.lesson.documentId,
                version: vm.lessonData.lesson.version,
                situation: vm.lessonData.situation,
                registeredDate: vm.lessonData.registeredDate,
                duration: vm.lessonData.duration,
                no: vm.lessonData.no,
                topic: vm.lessonData.topic,
                description: vm.lessonData.description,
            }
            CrudData.service(item, $rootScope.apis.addLesson, (response) => {
                if (response.data.status === globe.config.status_ok) {




                }
            });
        }
    }
});
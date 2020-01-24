var LessonCtrl = angular.module('LessonCtrl', []);

LessonCtrl.controller('LessonController', function ($rootScope, CrudData, Core, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.isSave = true;
    vm.lessonData = models.lesson;

    vm.departments = [];
    vm.levels = [];
    vm.numbers = [];
    vm.selectedLesson = false;

    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.departments = response.data.list;
        }
    });
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        let item = { parameter: 'departmentId', documentId: vm.lessonData.departmentId };
        CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
            if (response.data.status === globe.config.status_ok) {
                vm.levels = Core.findHierarchy(response.data.list);
            }
        });
    }
    // -----------------------------------------------------------------
    vm.changeVersion = function () {
        vm.numbers = [];
        if (vm.lessonData.lesson !== undefined) {
            for (let i = 0; i < vm.lessonData.lesson.amount; i++) {
                vm.numbers.push({ no: i });
            }
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
                    console.log(response);
                }
            });
        }
    }



});
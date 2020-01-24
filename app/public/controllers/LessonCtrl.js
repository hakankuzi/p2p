var LessonCtrl = angular.module('LessonCtrl', []);

LessonCtrl.controller('LessonController', function ($rootScope, CrudData, Core, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
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

    console.log(vm.lessonData);

    }



});
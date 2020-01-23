var LessonCtrl = angular.module('LessonCtrl', []);

LessonCtrl.controller('LessonController', function ($rootScope, CrudData, Core, $scope, $location) {
    var vm = this;
    vm.action = 'Save';
    vm.lessonData = models.lesson;
    vm.tempDate = models.lesson;
    vm.departments = [];
    vm.levels = [];
    vm.versions = [];
    vm.numbers = [];
    vm.selectedLesson = false;

    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.departments = response.data.list;
        }
    });
    // -----------------------------------------------------------------

    


});
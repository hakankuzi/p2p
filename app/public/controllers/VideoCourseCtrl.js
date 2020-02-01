var VideoCourseCtrl = angular.module('VideoCourseCtrl', []);
VideoCourseCtrl.controller('VideoCourseController', function ($rootScope, $scope, CrudData, Core, $location) {
    var vm = this;
    vm.properties = models.createVideoPropertiesObj();
    vm.videoData = models.createVideoObj();


    // get Departments --------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status = globe.config.status_ok) {
            vm.properties.departments = response.data.list;
            vm.videoData.departmentId = 'none';
        }
    });
    // -----------------------------------------------------------------
    vm.changeDepartment = function () {
        let isNone = globe.isNone(vm.videoData.departmentId);
        if (!isNone) {
            let item = { parameter: 'departmentId', documentId: vm.videoData.departmentId };
            CrudData.service(item, $rootScope.apis.getLevelsByDepartmentId, (response) => {
                if (response.data.status === globe.config.status_ok) {
                    vm.properties.levels = Core.findHierarchy(response.data.list);
                    vm.videoData.levelId = 'none';
                    vm.properties.isLevel = false;
                }
            });
        }
    }
    // -----------------------------------------------------------------


});
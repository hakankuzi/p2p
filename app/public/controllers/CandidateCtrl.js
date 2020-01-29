var CandidateCtrl = angular.module('CandidateCtrl', []);

CandidateCtrl.controller('CandidateController', function ($rootScope, $scope, CrudData, $location) {
    var vm = this;
    vm.candidateData = models.createCandidateObj();
    vm.properties = models.createCandidatePropertiesObj();

    // Get Departments ----------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status === globe.config.status_ok) {
            vm.properties.departments = response.data.list;
        }
    });
    // ------------------------------------------------------------------
    vm.changeDepartment = function () {
        CrudData.service({ parameter: 'departmentId', documentId: vm.candidateData.departmentId }, $rootScope.apis.getPackagesByDepartmentId, (response) => {
            if (response.data.status = globe.config.status_ok) {
                vm.properties.packages = response.data.list;
            } else {
                vm.properties.packages = [];
                alert('no package');
            }
        });
    }
    // ------------------------------------------------------------------





});
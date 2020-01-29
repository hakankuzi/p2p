var CandidateCtrl = angular.module('CandidateCtrl', []);

CandidateCtrl.controller('CandidateController', function ($rootScope, $scope, CrudData, $location) {
    var vm = this;
    vm.candidateData = models.createCandidateObj();
    vm.properties = models.createCandidatePropertiesObj();

    // Get Departments ----------------------------------------------------
    CrudData.service({}, $rootScope.apis.getDepartments, (response) => {
        if (response.data.status === globe.config.status_ok) {
            vm.departments = response.data.list;
            console.log(vm.departments);
        }
    });




});
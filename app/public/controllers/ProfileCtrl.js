var ProfileCtrl = angular.module('ProfileCtrl', []);

ProfileCtrl.controller('ProfileController', function ($timeout, Core, $scope, CrudData, $rootScope) {
    var vm = this;
    $scope.storage = null;
    vm.image = {};
    vm.isSave = false;
    vm.profileData = models.profile;
    vm.profileData.documentId = $rootScope.user.documentId;
    vm.profileData.uid = $rootScope.user.uid;
    vm.profileData.photoURL = $rootScope.user.photoURL;
    vm.profileData.displayName = $rootScope.user.displayName;
    vm.profileData.phoneNumber = $rootScope.user.phoneNumber;
    vm.profileData.username = $rootScope.user.username;
    vm.profileData.password = $rootScope.user.password;
    vm.profileData.email = $rootScope.user.email;
    vm.profileData.biography = $rootScope.user.biography;


    vm.updateProfile = function () {
        let methodName = $rootScope.apis.updateUser;
        Core.saveOrUpdateWithPhoto($rootScope.storage, vm.profileData, methodName, vm.image, vm.isSave, (response) => {
            console.log(response.status);
        });
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.profileData.photoURL, (response) => {
            vm.image = response;
            if (vm.image.status === globe.config.status_ok) {
                vm.profileData.photoURL = vm.image.item.path;
                $scope.$apply();
            }
        });
    };
    // --------------------------------------------------------------------



});
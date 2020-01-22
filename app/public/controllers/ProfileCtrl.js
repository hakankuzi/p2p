var ProfileCtrl = angular.module('ProfileCtrl', []);

ProfileCtrl.controller('ProfileController', function ($timeout, $scope, CrudData, $rootScope) {
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

    // firebase storage ----------------------------------------------------
    CrudData.service({}, $rootScope.apis.getFirebaseConfig, (response) => {
        if (response.data.status === '200') {
            firebase.initializeApp(response.data.config);
            $scope.storage = firebase.storage();
        }
    });
    // --------------------------------------------------------------------
    vm.updateProfile = function () {
        let methodName = $rootScope.apis.updateUser;
        Core.saveOrUpdateWithPhoto($scope.storage, vm.departmentData, methodName, vm.image, vm.isSave, (response) => {
            console.log(response.status);
        });

        CrudData.service(vm.profileData, $rootScope.apis.updateUser, (response) => {
            console.log(response);
        });
    }
    // --------------------------------------------------------------------
    $scope.choosePicPath = function (element) {
        Core.previewPhoto(element, vm.departmentData.photoURL, (response) => {
            vm.image = response;
        });
    };
    // --------------------------------------------------------------------



});
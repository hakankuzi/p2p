var ProfileCtrl = angular.module('ProfileCtrl', []);

ProfileCtrl.controller('ProfileController', function ($timeout, $scope, CrudData, $rootScope) {
    var vm = this;
    vm.profileData = {
        documentId : $rootScope.user.documentId,
        uid: $rootScope.user.uid,
        photoURL: 'assets/img/avatar.jpg',
        displayName: $rootScope.user.displayName,
        phoneNumber: $rootScope.user.phoneNumber,
        username: $rootScope.user.username,
        password: $rootScope.user.password,
        email: $rootScope.user.email,
        biography: $rootScope.user.biography,
    }
    vm.updateProfile = function () {
        CrudData.service(vm.profileData, $rootScope.apis.updateUser, (response) => {
            console.log(response);
        });
    }
});
'use strict'
var MockDataService = angular.module('MockDataService', []);

MockDataService.service('MockData', function ($http, $q) {

    var MockService = {};
    MockService.getMenus = function () {
        var deferred = $q.defer();
        $http.get('assets/json/Menus.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }
    return MockService;
});
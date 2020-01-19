'use strict'
var MockDataService = angular.module('MockDataService', []);

MockDataService.service('MockData', function ($http, $q) {

    var MockService = {};

    // FBADMIN ------------------------------------------
    MockService.service = function (item, methodName, callback) {
        return $http.post(methodName, {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }
    // --------------------------------------------------


    /*
    MockService.service = function (filename) {
        var deferred = $q.defer();
        $http.get(filename).then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }
    */

    return MockService;
});
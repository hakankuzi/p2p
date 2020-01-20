'use strict'
var MockDataService = angular.module('MockDataService', []);

MockDataService.service('MockData', function ($http, $q) {

    var MockService = {};

    // --------------------------------------------------
    MockService.service = function (item, methodName, callback) {
        return $http.post(methodName, {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }
    // --------------------------------------------------
    return MockService;
});
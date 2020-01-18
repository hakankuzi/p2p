'use strict'
var CrudDataService = angular.module('CrudDataService', []);
CrudDataService.service('CrudData', function ($http, $q) {
    var crudService = {};

    crudService.getCourses = function (item, callback) {
        return $http.post('/api/getCourses', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }
    return crudService;
});
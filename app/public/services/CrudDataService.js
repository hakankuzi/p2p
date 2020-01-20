'use strict'
var CrudDataService = angular.module('CrudDataService', []);
CrudDataService.service('CrudData', function ($http, $q) {
    var crudService = {};

    crudService.service = function (item, methodName, callback) {
    
        
        console.log(methodName);
        return $http.post(methodName, {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }
    return crudService;
});
'use strict'
var TokboxDataService = angular.module('TokboxDataService', []);

TokboxDataService.service('TokBoxData', function ($http, $q) {

    var tokboxService = {};

    // get tokbox sessionId -------------------------------------
    tokboxService.getSessionByScheduleId = function(item, callback){
        return $http.post('/api/getSessionByScheduleId', {
            item: item
        }).then(function (response) {
            callback(response);
        });     
    }
    // ---------------------------------------------------------

    // create tokbox service ------------------------------------
    // ----------------------------------------------------------
    tokboxService.createSession = function (item, callback) {
        return $http.post('/api/createSession', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    };
    // ----------------------------------------------------------
    // ----------------------------------------------------------

    // generate tokbox token ------------------------------------
    tokboxService.generateToken = function(item , callback){
        return $http.post('/api/generateToken', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }
    // -----------------------------------------------------------


    return tokboxService;
});
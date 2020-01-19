'use strict'
var AuthDataService = angular.module('AuthDataService', []);

AuthDataService.service("AuthWrapper", function ($http, $rootScope, AuthToken) {
    var authService = {};


    // FBADMIN ------------------------------------------
    authService.service = function (item, methodName, callback) {
        return $http.post(methodName, {
            item: item
        }).then(function (response) {
            if ((methodName === $rootScope.apis.createUser
                || methodName === $rootScope.apis.getUserWithEmailAndPassword)
                && response.data.status === '200') {
                AuthToken.setToken(response.data.token);
            }
            callback(response);
        });
    }
    // --------------------------------------------------


    authService.isLoggedIn = function () {
        if (AuthToken.getToken()) {
            return true
        } else {
            return false;
        }
    }

    authService.logout = function () {
        AuthToken.setToken();
    }

    authService.register = function (item, callback) {
        return $http.post('/api/register', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    };


    authService.getUser = function () {
        if (AuthToken.getToken()) {
            return $http.post('/api/me');
        } else {
            $q.reject({
                message: 'user has no token'
            });
        }
    }
    return authService;
});

AuthDataService.service('AuthToken', function ($window) {
    var authTokenService = {}
    authTokenService.setToken = function (token) {
        if (token) {
            $window.localStorage.setItem('owlege-token', token);
        } else {
            $window.localStorage.removeItem('owlege-token');
        }
    }
    authTokenService.getToken = function () {
        return $window.localStorage.getItem('owlege-token');
    }
    return authTokenService;
});

AuthDataService.service('AuthInterceptors', function (AuthToken) {
    var interceptorService = {};
    interceptorService.request = function (config) {
        var token = AuthToken.getToken();
        if (token) config.headers['x-access-token'] = token;
        return config;
    }
    return interceptorService;
});
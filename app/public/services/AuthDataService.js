'use strict'
var AuthDataService = angular.module('AuthDataService', []);

AuthDataService.service("AuthWrapper", function ($http, AuthToken) {
    var authService = {};

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
        console.log("new-user :", item);
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
                message: 'User has no token'
            });
        }
    }
    return authService;
});




AuthDataService.service('AuthToken', function ($window) {
    var authTokenService = {}
    authTokenService.setToken = function (token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    }
    authTokenService.getToken = function () {
        return $window.localStorage.getItem('token');
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
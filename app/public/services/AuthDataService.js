'use strict'
var AuthDataService = angular.module('AuthDataService', []);

AuthDataService.service("AuthWrapper", function ($http, $window, $rootScope, AuthToken) {
    var authService = {};

    // FBADMIN ------------------------------------------
    authService.service = function (item, methodName, callback) {
        return $http.post(methodName, {
            item: item
        }).then(function (response) {
            if ((methodName === $rootScope.apis.createUser
                || methodName === $rootScope.apis.getUserWithEmailAndPassword)
                && response.data.status === '200') {
                AuthToken.setToken(response.data.user.token);
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

    authService.setUser = function (user) {
        if (user) {
            $window.localStorage.setItem('owlege-user', JSON.stringify({ email: user.email, username: user.username }));
        } else {
            $window.localStorage.removeItem('owlege-user');
        }
    }
    authService.getUser = function () {
        return $window.localStorage.getItem('owlege-user');
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
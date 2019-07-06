'use strict'
var AuthDataService = angular.module('AuthDataService', []);

AuthDataService.service("AuthWrapper", function ($http, AuthToken) {
    var authService = {};


    authService.checkUsername = function (item, callback) {
        console.log('check-username : ', item.username);
        return $http.post('/api/checkusername', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    };

    authService.checkEmail = function (item, callback) {
        console.log('check-email : ', item.email);
        return $http.post('/api/checkemail', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    };

    authService.activateAccount = function (item, callback) {
        console.log('activate-account-token', item.token);
        return $http.post('/api/activate', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }

    authService.checkCredentials = function (item, callback) {
        return $http.post('/api/resend', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }

    authService.resendlink = function (item, callback) {
        return $http.post('/api/resendlink', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }

    authService.authenticate = function (item, callback) {
        console.log("authenticate-user ?", item);
        return $http.post('/api/authenticate', {
            item: item
        }).then(function (response) {
            console.log('token', response.data.token);
            AuthToken.setToken(response.data.token);
            authService.isLoggedIn();
            callback(response);
        });
    }


    authService.facebook = function (token) {
        AuthToken.setToken(token);
    }

    authService.getFacebookToken = function (token) {
        return AuthToken.getToken();
    }

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
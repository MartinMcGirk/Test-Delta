angular.module('AuthenticationService', []).factory('AuthenticationService', [function() {
    var auth = {
        isLogged: false
    }

    return auth;
}]);
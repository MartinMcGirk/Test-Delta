angular.module('UserService', []).factory('UserService', ['$http', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('api/login', {username: username, password: password});
        },

        logOut: function() {

        }
    }
}]);
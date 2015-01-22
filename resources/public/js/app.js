var overseer = angular.module('app', ['ngRoute', 'ui.bootstrap']);

overseer.config(function($locationProvider, $routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/student/new', {
            templateUrl: 'views/createstudent.html'
        })
        .when('/student/:name', {
            templateUrl: 'views/student.html',
            controller: function($scope, $routeParams){
                $scope.att = $scope.$parent.students.filter(function(s){
                    return s.name === $routeParams.name; 
                })[0];
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});


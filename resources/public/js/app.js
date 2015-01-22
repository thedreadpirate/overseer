var overseer = angular.module('app', ['services', 'ngRoute', 'ui.bootstrap', 'services']);

overseer.config(function ($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'homeCtrl'
    })
    .when('/student/new', {
      templateUrl: 'views/createstudent.html'
    })
    .when('/student/:name', {
      templateUrl: 'views/student.html',
      controller: 'StudentCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
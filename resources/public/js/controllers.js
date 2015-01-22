angular
  .module('app')
  .controller('HomeCtrl', function (studentService) {
    var self = this;
    studentService.getStudents().then(function (data) {
      self.students = data;
    })

  })
  .controller('StudentCtrl', function ($scope, $routeParams, studentService) {
    studentService.getStudent($routeParams.name).then(function (student) {
      $scope.att = student;
    });
  });
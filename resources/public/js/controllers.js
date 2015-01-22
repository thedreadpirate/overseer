angular
  .module('app')
  .controller('HomeCtrl', function (studentService) {
    var self = this;
    studentService.getStudents().then(function (data) {
      self.students = data;
    })

  })
  .controller('StudentCtrl', function ($scope, $routeParams, studentService) {
    studentService.getStudents().then(function (data) {
      console.log('ctrl');
      console.log(data);
      $scope.att = data.filter(function (s) {
        return s.name === $routeParams.name;
      })[0];
    });
  });
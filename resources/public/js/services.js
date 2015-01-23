angular
  .module('services', [])
  .service('studentService', function ($http, $q) {
    var students;

    var applyToStudents = function (call) {
      var deferred = $q.defer();

      call().then(function (data) {
        students = data.dat
        deferred.resolve(data);
      })
    };

    this.getStudent = function (name) {
      var deferred = $q.defer();

      this.getStudents().then(function (data) {
        deferred.resolve(
          data.filter(function (s) {
            return s.name === name;
          })[0]);
      });

      return deferred.promise;
    }

    this.getStudents = function () {
      var deferred = $q.defer();
      if (!students) {
        $http.post('/student/all')
          .then(function (data) {
            students = data.data;
            deferred.resolve(data.data);
          });
      } else {
        deferred.resolve(students);
      }
      return deferred.promise;
    };

    this.createStudent = function (student) {
      return $http.post('/student/create', {
        "name": name
      }).then(function (data) {
        students = data.data.students;
        return data.data;
      });
    };

  });
angular
  .module('services', [])
  .service('studentService', function ($http, $q) {
    var students, totals_students;

    var loadStudentData = function (data) {
      console.log('student data');
      console.log(data);
      students = data;
      totals_students = data;
    };

    this.getStudents = function (callback) {
      var deferred = $q.defer();
      if (!students) {
        $http.post('/student/all')
          .then(function (data) {
            loadStudentData(data.data);
            deferred.resolve(data.data);
          });
      } else {
        deferred.resolve(students);
      }
      return deferred.promise;
    };
  });
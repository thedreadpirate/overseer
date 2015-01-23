angular
  .module('app')
  .controller('HomeCtrl', function (studentService) {
    var self = this;

    studentService.getStudents().then(function (data) {
      self.students = data;
    });
  })
  .controller('StudentCtrl', function ($routeParams, studentService) {
    var self = this;

    studentService.getStudent($routeParams.name).then(function (student) {
      self.student = student;
    });

    self.createStudent = function (name) {
      studentService
        .createStudent(name)
        .then(function (data) {
          console.log(data);
        })
    }

    self.requiredMinutes = function (student) {
      if (!self.student) {
        return "";
      }
      return self.student.olderdate ? 330 : 300;
    };

    self.override = function (id, day) {
      if (confirm("Override " + day + "?")) {
        self.screen = "saving";
        $http.post('/override', {
          "_id": id,
          "day": day
        }).
        success(function (data) {
          self.student = data.student;
          self.current_day = data.student.days[0];
          self.loadStudentData(data.all);
          self.screen = "student";
        }).error(function () {});
      }
    };
    self.get_missing_swipe = function () {
      var d = new Date();
      if (self.att.last_swipe_date) {
        d = new Date(self.att.last_swipe_date + "T10:00:00");
      }
      self.missing_direction = (self.att.last_swipe_type == "in") ? "out" : "in";
      d.setHours((self.missing_direction == "in") ? 8 : 15);
      d.setMinutes(0);
      self.missing_swipe = d;
      self.screen = "get-swipe-time";
    };
    self.swipe_with_missing = function (missing) {
      self.att.missing = missing;
      self.missing_swipe = "";
      self.makeSwipePost();
    };
    self.makeSwipePost = function () {
      self.screen = "saving";
      $http.post('/swipe', {
        "_id": self.att._id,
        "direction": self.att.direction,
        "missing": self.att.missing
      }).
      success(function (data) {
        self.loadStudentData(data);
        self.showHome(self.att.name + " swiped successfully!");
      }).error(function () {});
    };
    self.inButtonStyle = function () {
      if (!self.att) {
        return "";
      }
      return (self.att.last_swipe_type == "out") ? "btn-lg btn-success" : "";
    };
    self.outButtonStyle = function () {
      if (!self.att) {
        return "";
      }
      return (self.att.last_swipe_type == "in") ? "btn-lg btn-success" : "";
    };
    self.hideSwipeOut = function () {
      if (self.att) {
        return (self.att.today != self.att.last_swipe_date) && self.att.last_swipe_type;
      }
      return true;
    };
    self.swipe = function (direction) {
      self.att.direction = direction;
      if (((self.att.last_swipe_type == "out" || !self.att.last_swipe_type) && direction == "out") || (self.att.last_swipe_type == "in" && direction == "in")) {
        self.get_missing_swipe();
      } else {
        self.makeSwipePost();
      }
    };
  });
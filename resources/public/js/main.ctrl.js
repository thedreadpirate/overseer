angular.module('app').controller("MainController", function ($http) {
  var self = this;
  self.students = [];
  self.screen = "home";
  self.current_totals_year = null;
  self.missing_date = "";
  self.missing_swipe = "";
  self.backStudent = function (s) {
    self.swipedWorked = false;
    self.screen = "student";
  };
  self.showStudent = function (s) {
    self.swipedWorked = false;
    self.backStudent();
    self.att = s;
    self.current_day = s.days[0];
  };
  self.showHome = function (worked) {
    self.swipedWorked = worked;
    self.screen = "home";
  };
  self.showSwipedToday = function () {
    self.swipedWorked = false;
    self.screen = "swiped-today";
  };
  self.showCreate = function () {
    self.swipedWorked = false;
    self.screen = "create";
  };
  self.showCreateYear = function () {
    self.swipedWorked = false;
    self.screen = "create-year";
  };
  self.showStudents = function () {
    self.swipedWorked = false;
    self.screen = "student-totals";
  };
  self.setDay = function (s) {
    self.current_day = s;
  };
  self.override = function (id, day) {
    if (confirm("Override " + day + "?")) {
      self.screen = "saving";
      $http.post('/override', {
        "_id": id,
        "day": day
      }).
      success(function (data) {
        self.att = data.student;
        self.current_day = data.student.days[0];
        self.loadStudentData(data.all);
        self.screen = "student";
      }).error(function () {});
    }
  };
  self.requiredMinutes = function (student) {
    if (!student) {
      return "";
    }
    return student.olderdate ? 330 : 300;
  };
  self.createYear = function () {
    if (confirm("Create school year from " + self.from_date + " to " + self.to_date + "?")) {
      $http.post('/year/create', {
        "from_date": self.from_date,
        "to_date": self.to_date
      }).
      success(function (data) {
        self.init();
      }).error(function () {});
    }
  };
  self.toggleHours = function (student) {
    if (confirm(student.olderdate ? "Mark student younger?" : "Mark student as older starting today?")) {
      student.olderdate = !!!student.olderdate;
      $http.post('/student/togglehours', {
        _id: student._id
      }).
      success(function (data) {
        self.getStudents();
        self.init();
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

  self.getTotalsStudents = function () {
    $http.post('/student/all', {
      "year": self.current_totals_year
    }).
    success(function (data) {
      self.totals_students = data;
    }).error(function () {});
  };
  self.loadStudentData = function (data) {
    self.students = data;
    self.totals_students = data;
  };
  self.getStudents = function (callback) {
    $http.post('/student/all').
    success(function (data) {
      self.loadStudentData(data);
      if (callback) {
        callback();
      }
    }).error(function () {});
  };
  self.getYears = function () {
    $http.get('/year/all').
    success(function (data) {
      self.years = data.years;
      self.current_totals_year = data.current_year;
    }).error(function () {});
  };
  self.deleteYear = function (year) {
    if (confirm("Delete year " + year + "?")) {
      $http.post('/year/delete', {
        "year": year
      }).
      success(function (data) {
        self.years = data.years;
        self.current_totals_year = data.current_year;
        self.init();
      }).error(function () {});
    }
  };
  self.isAdmin = false;
  self.checkRole = function () {
    $http.post('/is-admin').
    success(function (data) {
      self.isAdmin = true;
    }).error(function () {});
  };
  self.init = function () {
    self.screen = "loading";
    self.checkRole();
    self.getYears();
    self.showHome();
  };
  self.init();
});
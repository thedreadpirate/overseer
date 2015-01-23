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
    // self.screen = "loading";
    self.checkRole();
    // self.getYears();
    // self.showHome();
  };
  self.init();
});
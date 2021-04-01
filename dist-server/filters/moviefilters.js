"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wholeService = _interopRequireDefault(require("../service/wholeService"));

var _genreService = _interopRequireDefault(require("../service/genreService"));

var _circuitBreaker = _interopRequireDefault(require("../circuitBreaker/circuitBreaker"));

var breaker1 = new _circuitBreaker["default"](_wholeService["default"]);
var breaker2 = new _circuitBreaker["default"](Promise.all([_wholeService["default"], _genreService["default"]]));

var wholeresFilter = function wholeresFilter(req, res) {
  try {
    breaker1.fire().then(function (response) {
      var movies = response.data.results;
      res.json(movies);
    })["catch"](res.sendStatus(500));
  } catch (err) {
    res.sendStatus(500);
  }
};

var popFilter = function popFilter(req, res) {
  try {
    breaker1.fire().then(function (response) {
      var movies = response.data.results;
      var popularity = req.headers.popularity;

      try {
        if (popularity === "" || popularity === undefined) {
          res.json(movies);
        } else {
          res.json(movies.filter(function (item) {
            return item.popularity > popularity;
          }));
        }
      } catch (error) {
        console.error(error);
      }
    })["catch"](res.sendStatus(500));
  } catch (err) {
    res.sendStatus(500);
  }
};

var dateFilter = function dateFilter(req, res) {
  try {
    breaker1.fire().then(function (response) {
      var movies = response.data.results;
      var startDate = req.headers.datenum;
      var datenum = new Date(startDate);

      try {
        if (startDate === "" || startDate === undefined) {
          res.json(movies);
        } else {
          res.json(movies.filter(function (item) {
            return new Date(item.release_date) >= datenum;
          }));
        }
      } catch (error) {
        console.error(error);
      }
    })["catch"](res.sendStatus(500));
  } catch (_unused) {
    res.sendStatus(500);
  }
};

var genreFilter = function genreFilter(req, res) {
  try {
    breaker2.fire().then(function (response) {
      return Promise.all(response.map(function (res) {
        return res.data;
      }));
    }).then(function (data) {
      var arr = [];
      var display = [];
      var name = req.headers.gen;
      var names;

      if (name === undefined || name === "") {
        names = name;
      } else {
        names = name.split(",");
      }

      var resOne = data[0];
      var resTwo = data[1];
      var resp = resOne.results;

      if (name === "" || name === undefined) {
        res.json(resp);
      } else {
        var gen = resTwo.genres; //fetching the required genre ids 

        for (var i = 0; i < names.length; i++) {
          for (var j = 0; j < gen.length; j++) {
            if (names[i] === gen[j].name) {
              arr.push(gen[j].id);
              break;
            }
          }
        }

        console.log(arr); //filtering genre ids from whole movie list by filter method

        resOne.results.filter(function (item) {
          for (var _i = 0; _i < item.genre_ids.length; _i++) {
            if (arr.indexOf(item.genre_ids[_i]) != -1) {
              display.push(item);
              break;
            }
          }
        });
        res.json(display);
      }
    })["catch"](res.sendStatus(500));
  } catch (err) {
    console.log(err);
  }
};

var allFilter = function allFilter(req, res) {
  try {
    breaker2.fire().then(function (response) {
      return Promise.all(response.map(function (res) {
        return res.data;
      }));
    }).then(function (data) {
      var pop = req.headers.popularity;
      var dt = req.headers.datenum;
      var date = new Date(dt);
      var genres = req.headers.gen;
      var gene;
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];

      if (genres === undefined || genres === "") {
        gene = genres;
      } else {
        gene = genres.split(",");
      }

      var resOne = data[0];
      var resTwo = data[1];

      if (genres === undefined || genres === "") {
        arr1 = resOne.results;
      } else {
        var arr = [];
        var gen = resTwo.genres; //filtering of genre ids

        for (var i = 0; i < gene.length; i++) {
          for (var j = 0; j < gen.length; j++) {
            if (gene[i] === gen[j].name) {
              arr.push(gen[j].id);
              break;
            }
          }
        }

        console.log(arr); //filtering of movie data

        resOne.results.filter(function (item) {
          for (var _i2 = 0; _i2 < item.genre_ids.length; _i2++) {
            if (arr.indexOf(item.genre_ids[_i2]) != -1) {
              arr1.push(item);
              break;
            }
          }
        });
      }

      if (pop == "" || pop == undefined) {
        arr2 = arr1;
      } else arr2 = arr1.filter(function (result) {
        return result.popularity >= pop;
      });

      if (dt == "" || dt == undefined) arr3 = arr2;else arr3 = arr2.filter(function (result) {
        return new Date(result.release_date) >= date;
      });
      res.send(arr3);
    })["catch"](res.sendStatus(500));
  } catch (err) {
    console.log(err);
  }
};

var _default = {
  wholeresFilter: wholeresFilter,
  popFilter: popFilter,
  dateFilter: dateFilter,
  genreFilter: genreFilter,
  allFilter: allFilter
};
exports["default"] = _default;
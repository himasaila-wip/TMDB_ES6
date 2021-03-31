"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _https = _interopRequireDefault(require("https"));

var _constants = _interopRequireDefault(require("../constants/constants"));

var _circuitBreaker = _interopRequireDefault(require("../circuitBreaker/circuitBreaker"));

var agent = new _https["default"].Agent({
  rejectUnauthorized: false
});
var api1 = _constants["default"].movies;
var api2 = _constants["default"].genres; // const wait = time => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             return resolve();
//         }, time);
//     });
// };
// function wholeResponse(req, res) {
//     let id = req.headers.id;
//      axios.get(api1, {
//             httpsAgent: agent
//         })
//         .then((response) => {
//             res.json(response.data)
//         })
//         .catch((error) => {
//             console.error(error)
//         })
// }

var breaker = new _circuitBreaker["default"]();

var wholeResponse = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var id, api, vari;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.headers.id;
            api = api1;
            vari = breaker.fire(api);
            vari.then(function (response) {
              return res.json(response.data);
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function wholeResponse(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var popularity = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, popularity, response, resp;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.headers.id;
            popularity = req.headers.popularity;
            _context2.prev = 2;
            _context2.next = 5;
            return _axios["default"].get(api1, {
              httpsAgent: agent
            });

          case 5:
            response = _context2.sent;
            resp = response.data.results;

            if (popularity === "" || popularity === undefined) {
              res.json(resp);
            } else {
              res.json(resp.filter(function (item) {
                return item.popularity > popularity;
              }));
            }

            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](2);
            console.error(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 10]]);
  }));

  return function popularity(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var date = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var startDate, datenum, id;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            startDate = req.headers.datenum;
            datenum = new Date(startDate);
            id = req.headers.id;

            _axios["default"].get(api1, {
              httpsAgent: agent
            }).then(function (response) {
              var resp = response.data.results;

              if (startDate === "" || startDate === undefined) {
                res.json(resp);
              } else {
                res.json(resp.filter(function (item) {
                  return new Date(item.release_date) >= datenum;
                }));
              }
            })["catch"](function (error) {
              console.error(error);
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function date(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var genres = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var id, name, names, arr, display;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.headers.id;
            name = req.headers.gen;

            if (name === undefined || name === "") {
              names = name;
            } else {
              names = name.split(",");
            }

            arr = [];
            display = [];
            Promise.all([_axios["default"].get(api1, {
              httpsAgent: agent
            }), _axios["default"].get(api2, {
              httpsAgent: agent
            })]).then(function (responses) {
              return Promise.all(responses.map(function (response) {
                return response.data;
              }));
            }).then(function (data) {
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
            })["catch"](function (error) {
              console.error(error);
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function genres(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var filter = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var id, pop, dt, date, genres, gene, arr1, arr2, arr3;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.headers.id;
            pop = req.headers.popularity;
            dt = req.headers.datenum;
            date = new Date(dt);
            genres = req.headers.gen;
            arr1 = [];
            arr2 = [];
            arr3 = [];

            if (genres === undefined || genres === "") {
              gene = genres;
            } else {
              gene = genres.split(",");
            }

            Promise.all([_axios["default"].get(api1, {
              httpsAgent: agent
            }), _axios["default"].get(api2, {
              httpsAgent: agent
            })]).then(function (responses) {
              return Promise.all(responses.map(function (response) {
                return response.data;
              }));
            }).then(function (data) {
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
            })["catch"](function (error) {
              console.error(error);
            });

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function filter(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var _default = {
  wholeResponse: wholeResponse,
  popularity: popularity,
  date: date,
  genres: genres,
  filter: filter
};
exports["default"] = _default;
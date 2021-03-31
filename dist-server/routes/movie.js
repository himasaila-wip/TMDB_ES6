"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _movieService = _interopRequireDefault(require("../service/movieService"));

var _circuitBreaker = _interopRequireDefault(require("../circuitBreaker/circuitBreaker"));

var router = _express["default"].Router(); // router.get('/',function (req, res, next) {
//         breaker.fire(req,res)
//         .then(console.log)
//         .catch(console.error);
// });
// router.get('/', function (req, res, next) { 
//     const breaker = new circuitBreaker(service.wholeResponse(req,res)); 
//     console.log(breaker);
//     breaker.fire()
//     .then(response=>{
//     console.log("Success in circuit breaker", response);
//     res.json(response);
//     })
//     .catch(error=>{
//     console.log("Error in circuit breaker", error)
//     res.json("error in downsteam");
//     });
// });
//filter by wholedata


router.get('/', function (req, res, next) {
  _movieService["default"].wholeResponse(req, res);
}); //filter by popularity

router.get('/popularity', function (req, res, next) {
  _movieService["default"].popularity(req, res);
}); //filter by date

router.get('/date', function (req, res, next) {
  _movieService["default"].date(req, res);
}); //filter by  genres(using axios.all)

router.get('/genre', function (req, res, next) {
  _movieService["default"].genres(req, res);
}); //filter by using popularity date & gen

router.get('/filter', function (req, res, next) {
  _movieService["default"].filter(req, res);
});
var _default = router;
exports["default"] = _default;
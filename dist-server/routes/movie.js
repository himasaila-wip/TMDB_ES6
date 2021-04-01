"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _moviefilters = _interopRequireDefault(require("../filters/moviefilters"));

var router = _express["default"].Router(); //filter by whole response


router.get('/', function (req, res, next) {
  _moviefilters["default"].wholeresFilter(req, res);
}); //filter by popularity

router.get('/popularity', function (req, res, next) {
  _moviefilters["default"].popFilter(req, res);
}); //filter by date

router.get('/date', function (req, res, next) {
  _moviefilters["default"].dateFilter(req, res);
}); //filter by  genres

router.get('/genre', function (req, res, next) {
  _moviefilters["default"].genreFilter(req, res);
}); //filter by using popularity date & gen

router.get('/filter', function (req, res, next) {
  _moviefilters["default"].allFilter(req, res);
});
var _default = router;
exports["default"] = _default;
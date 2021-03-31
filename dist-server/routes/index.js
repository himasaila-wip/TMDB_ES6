"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

// var express = require('express');
// var router = express.Router();
var router = _express["default"].Router();
/* GET home page. */


router.get('/', function (req, res, next) {
  res.send({
    title: 'hima'
  });
});
var _default = router; //module.exports = router;

exports["default"] = _default;
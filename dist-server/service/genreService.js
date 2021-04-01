"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _https = _interopRequireDefault(require("https"));

var _constants = _interopRequireDefault(require("../constants/constants"));

var agent = new _https["default"].Agent({
  rejectUnauthorized: false
});
var api2 = _constants["default"].genres;

var genreResponse = function genreResponse() {
  try {
    var resp = _axios["default"].get(api2, {
      httpsAgent: agent
    });

    return resp;
  } catch (err) {
    console.error(err);
  }
};

var _default = genreResponse();

exports["default"] = _default;
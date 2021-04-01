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
var api1 = _constants["default"].movies;

var wholeResponse = function wholeResponse() {
  try {
    var resp = _axios["default"].get(api1, {
      httpsAgent: agent
    });

    return resp;
  } catch (err) {
    console.error(err);
  }
};

var _default = wholeResponse();

exports["default"] = _default;
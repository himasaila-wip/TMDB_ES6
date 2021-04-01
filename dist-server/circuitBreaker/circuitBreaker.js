"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _https = _interopRequireDefault(require("https"));

var _axios = _interopRequireDefault(require("axios"));

var NodeCache = require("node-cache");

var myCache = new NodeCache({
  stdTTL: 100,
  checkperiod: 120
});
var agent = new _https["default"].Agent({
  rejectUnauthorized: false
});

var circuitBreaker = /*#__PURE__*/function () {
  function circuitBreaker(request) {
    (0, _classCallCheck2["default"])(this, circuitBreaker);
    this.request = request;
    this.state = "CLOSED";
    this.failureThreshold = 3;
    this.failureCount = 0;
    this.successThreshold = 2;
    this.successCount = 0;
    this.timeout = 6000;
    this.nextAttempt = Date.now();
  }

  (0, _createClass2["default"])(circuitBreaker, [{
    key: "fire",
    value: function () {
      var _fire = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.state === "OPEN")) {
                  _context.next = 6;
                  break;
                }

                if (!(this.nextAttempt <= Date.now())) {
                  _context.next = 5;
                  break;
                }

                this.state = "HALF";
                _context.next = 6;
                break;

              case 5:
                throw new Error("Breaker is OPEN");

              case 6:
                _context.prev = 6;
                _context.next = 9;
                return this.request;

              case 9:
                response = _context.sent;
                return _context.abrupt("return", this.success(response));

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](6);
                return _context.abrupt("return", this.fail(_context.t0));

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 13]]);
      }));

      function fire() {
        return _fire.apply(this, arguments);
      }

      return fire;
    }() // async fire(api) {
    //   if (this.state === "OPEN") {
    //     if (this.nextAttempt <= Date.now()) {
    //       this.state = "HALF"
    //     } else {
    //       throw new Error("Breaker is OPEN")
    //     }
    //   }
    //   try {
    //     const response =await  axios.get(api, {httpsAgent: agent})
    //     return this.success(response)
    //   } catch (err) {
    //     return this.fail(err)
    //   }
    // }

  }, {
    key: "success",
    value: function success(response) {
      if (this.state === "HALF") {
        this.successCount++;

        if (this.successCount > this.successThreshold) {
          this.successCount = 0;
          this.state = "CLOSED";
        }
      }

      this.failureCount = 0;
      this.status("Success");
      return response;
    }
  }, {
    key: "fail",
    value: function fail(err) {
      this.failureCount++; //   if(myCache.take("failurecount") === undefined)
      // {
      //     myCache.set("failurecount", 0, 1000);
      // }    
      // console.log(this.failureCount)
      //  console.log("cachevalue ,"+myCache.take("failurecount"))
      //   myCache.set( "failurecount",myCache.take("failurecount")+ this.failureCount );

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        this.nextAttempt = Date.now() + this.timeout;
      }

      this.status("Failure");
      return err;
    }
  }, {
    key: "status",
    value: function status(action) {
      console.table({
        Action: action,
        Timestamp: Date.now(),
        Successes: this.successCount,
        Failures: this.failureCount,
        State: this.state
      });
    }
  }]);
  return circuitBreaker;
}();

module.exports = circuitBreaker;
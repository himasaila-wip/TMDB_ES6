// var express = require('express');
// var router = express.Router();
import express from 'express';
let router = express.Router();
// ..stuff below
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with user');
});

export default router;
//module.exports = router;

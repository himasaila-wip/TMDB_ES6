import express from 'express';
import filter from '../filters/moviefilters';
let router = express.Router();


//filter by whole response
router.get('/', function (req, res, next) {
    filter.wholeresFilter(req, res);
});

//filter by popularity
router.get('/popularity', function (req, res, next) {
    filter.popFilter(req, res);
});

//filter by date
router.get('/date', function (req, res, next) {
    filter.dateFilter(req, res);
});

//filter by  genres
router.get('/genre', function (req, res, next) {
    filter.genreFilter(req, res);
});


//filter by using popularity date & gen
router.get('/filter', function (req, res, next) {
    filter.allFilter(req, res);

});

export default router;
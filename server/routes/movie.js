import express from 'express';
import service from "../service/movieService";
let router = express.Router();

//getting all movie data
router.get('/',function (req, res, next) {
    service.wholeResponse(req, res);
});
//filter by popularity
router.get('/popularity', function(req, res, next) {
    service.popularity(req, res);
});

//filter by date
router.get('/date',  function (req, res, next) {
    service.date(req, res);
});

//filter by  genres(using axios.all)
router.get('/genre',  function (req, res, next) {
    service.genres(req, res);
});

//filter by using popularity date & gen
router.get('/filter',  function (req, res, next) {
    service.filter(req, res);

});

export default router;
import express from 'express';
import service from "../service/movieService";
import circuitBreaker from '../circuitBreaker/circuitBreaker';
let router = express.Router();


// router.get('/',function (req, res, next) {
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
router.get('/', function(req, res, next) {
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
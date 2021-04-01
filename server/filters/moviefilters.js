import service1 from "../service/wholeService";
import service2 from "../service/genreService";
import circuitBreaker from '../circuitBreaker/circuitBreaker';

const breaker1 = new circuitBreaker(service1);
const breaker2 = new circuitBreaker(Promise.all([service1,service2]));
const wholeresFilter=(req,res)=>{
    try{
        breaker1.fire().then(response => {
            let movies = response.data.results;
            res.json(movies);
            }).catch(res.sendStatus(500))
        }
        catch(err){
            res.sendStatus(500)
        }
}


const popFilter=(req,res)=>{
    try{
        breaker1.fire().then(response => {
            let movies = response.data.results;
            let popularity = req.headers.popularity;
            try{
                if (popularity === "" || popularity === undefined) {
                        res.json(movies);
                    } 
                else{
                        res.json(movies.filter(item => (item.popularity > popularity)))
                    }
                }catch(error){
                        console.error(error)
                }
        }).catch(res.sendStatus(500))
    }
    catch(err){
        res.sendStatus(500)
    }
}


const dateFilter=(req,res)=>{
    try{
       breaker1.fire().then(response => {
            let movies = response.data.results;
            let startDate = req.headers.datenum;
            let datenum = new Date(startDate);
            try{
                if (startDate === "" || startDate === undefined) {
                        res.json(movies);
                    } else {
                        res.json(movies.filter(item => new Date(item.release_date) >= datenum))
                    }
                }catch(error){
                        console.error(error)
                }
        }).catch(res.sendStatus(500))
    }
    catch{
        res.sendStatus(500)
    }
}

    
const genreFilter=(req,res)=>{
try{
   breaker2.fire()
    .then(response => {
        return Promise.all(response.map((res)=>{
            return res.data;
        }));
    })
    .then(function (data) {
        let arr = [];
        let display = [];
        let name = req.headers.gen;
        let names;
        if (name === undefined || name === "") {
            names = name;
        } else {
            names = name.split(",");
        }
        const resOne = data[0]
        const resTwo = data[1]
        let resp = resOne.results;
        if(name === "" || name === undefined){
            res.json(resp);
        }
        else{
            let gen = resTwo.genres;
            //fetching the required genre ids 
            for (let i = 0; i < names.length; i++) {
                for (let j = 0; j < gen.length; j++) {
                    if (names[i] === gen[j].name) {
                        arr.push(gen[j].id);
                            break;
                        }
                    }
                }
            console.log(arr);
            //filtering genre ids from whole movie list by filter method
            resOne.results.filter(item => {
            for (let i = 0; i < item.genre_ids.length; i++) {
                if (arr.indexOf(item.genre_ids[i]) != -1) {
                    display.push(item);
                    break;
                }
            }
            })
            res.json(display);
        }}).catch(res.sendStatus(500))
    }catch(err){
        console.log(err);
    }
}


const allFilter=(req,res)=>{
    try{
        breaker2.fire()
        .then(response => {
            return Promise.all(response.map((res)=>{
                return res.data;
            }));
        })
        .then(function (data) {
            let pop = req.headers.popularity;
            let dt = req.headers.datenum;
            let date = new Date(dt);
            let genres = req.headers.gen;
            let gene;
            let arr1 = [];
            let arr2 = [];
            let arr3 = [];
            if (genres === undefined || genres === "") {
                    gene = genres;
                } else {
                    gene = genres.split(",");
                }
                const resOne = data[0]
                const resTwo = data[1]
                if (genres === undefined || genres === "") {
                    arr1 = resOne.results;
                } else {
                    let arr = [];
                    let gen = resTwo.genres;
                    //filtering of genre ids
                    for (let i = 0; i < gene.length; i++) {
                        for (let j = 0; j < gen.length; j++) {
                            if (gene[i] === gen[j].name) {
                                arr.push(gen[j].id);
                                    break;
                                    }
                                }
                            }
                            console.log(arr);
                        //filtering of movie data
                        resOne.results.filter(item => {
                        for (let i = 0; i < item.genre_ids.length; i++) {
                            if (arr.indexOf(item.genre_ids[i]) != -1) {
                                arr1.push(item);
                                break;
                                }
                            }
                        })
                }
                if (pop == "" || pop == undefined) {
                    arr2 = arr1;
                } else
                    arr2 = arr1.filter(result => (result.popularity >= pop))
                if (dt == "" || dt == undefined)
                    arr3 = arr2;
                else
                    arr3 = arr2.filter(result => (new Date(result.release_date) >= date))
                res.send(arr3)
        }).catch(res.sendStatus(500))
    }catch(err){
        console.log(err);
    }
}

export default {wholeresFilter,popFilter,dateFilter,genreFilter,allFilter};
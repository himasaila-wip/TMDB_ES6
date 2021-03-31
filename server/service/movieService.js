import axios from 'axios';
import https from 'https';
import apis from '../constants/constants';
import cb from '../circuitBreaker/circuitBreaker';
const agent = new https.Agent({
    rejectUnauthorized: false,
});
let api1 = apis.movies;
let api2 = apis.genres;

// const wait = time => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             return resolve();
//         }, time);
//     });
// };

// function wholeResponse(req, res) {
//     let id = req.headers.id;
//      axios.get(api1, {
//             httpsAgent: agent
//         })
//         .then((response) => {
//             res.json(response.data)
//         })
//         .catch((error) => {
//             console.error(error)
//         })

// }

    let breaker = new cb()
    const wholeResponse = async(req, res)=> {
            let id = req.headers.id;
            let api = api1;
            let vari = breaker.fire(api);
            vari.then(response=>res.json(response.data));
        };

    const popularity = async (req, res) => {
        let id = req.headers.id;
        let popularity = req.headers.popularity;
        try{
            const response = await axios.get(api1, {httpsAgent: agent})
            let resp = response.data.results;
            if (popularity === "" || popularity === undefined) {
                res.json(resp);
            } else {
                res.json(resp.filter(item => (item.popularity > popularity)))
            }
            }catch(error) {
                console.error(error)
            }
    };

    const date = async(req, res)=> {
        let startDate = req.headers.datenum;
        let datenum = new Date(startDate);
        let id = req.headers.id;
        axios.get(api1, {
                httpsAgent: agent
            })
            .then((response) => {
                let resp = response.data.results;

                if (startDate === "" || startDate === undefined) {
                    res.json(resp);
                } else {
                    res.json(resp.filter(item => new Date(item.release_date) >= datenum))
                }
            })
            .catch((error) => {
                console.error(error)
            })
    };

    const genres = async(req, res)=> {
        let id = req.headers.id;
        let name = req.headers.gen;
        let names;
        if (name === undefined || name === "") {
            names = name;
        } else {
            names = name.split(",");
        }
        let arr = [];
        let display = [];
        Promise.all(
                [axios.get(api1, {
                    httpsAgent: agent
                }), axios.get(api2, {
                    httpsAgent: agent
                })]).then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.data;
                }));
            }).then(function (data) {
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
            }})
            .catch((error) => {
                console.error(error)
            })

    };

    const filter= async(req, res)=> {
        let id = req.headers.id;
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
        Promise.all(
            [axios.get(api1, {
                httpsAgent: agent
            }), axios.get(api2, {
                httpsAgent: agent
            })]).then(function (responses) {
            return Promise.all(responses.map(function (response) {
                return response.data;
            }));
        }).then(function (data) {
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

        }).catch((error) => {
            console.error(error)
        })


    }

export default {wholeResponse,popularity,date,genres,filter};
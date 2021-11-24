var fs = require('fs');

//petite méthode générique pour throw une erreur et arreter le systeme en dehors d'un try catch
// plus ca par cas qu'un try catch
var throwError = require('../Utils/ThrowError');
const MAXDEPTHACCEPTED = 32
//chemin du chien json
const path = "config-filters.json";


module.exports = function checkFilters() {

    // has config-filters.json ?
    fileexists();

    //le format json est bien valide
    isValidJson();

    //le jjson possède t-il toutes propriété attendues et au bon format
    isVlaidFilterConfig();

    //la profoindeur du json max
    checkMaxDepthOfJson();

}


let fileexists = () => {

    console.log("............checking if 'console-filters.json' exist ...........")
    try {
        fs.existsSync(path)

    } catch (err) {

        console.log("-> !! error: doesn't exist  !!!!!");
        throw err;
    }

}

let isValidJson = () => {
    console.log("............checking 'console-filters.json' is valid json file ...................")
    try {
        let file = fs.readFileSync(path)
        let json = JSON.parse(file);

    } catch (err) {
        console.log("-> !! Error while reading the 'console-filters.json' file");
        throw err;
    }

}

let isVlaidFilterConfig = () => {

    console.log("............checking if 'console-filters.json' contains valid filters configuration ...........")


        let file = fs.readFileSync(path)
        let json = JSON.parse(file);
        //check if the json contains the key steps
        if(!json["steps"]) {
            throwError("console-filters.json Json oject is  incorrect : Steps does'nt exist");
        }
        for(let key in json){
            if(key !== "steps"){
                throwError("console-filters.json Json oject is  incorrect : one of the root key is not <<Steps>>")
            }
        }
        //check if steps children are numbers
        for(var number in json["steps"]){
            if(isNaN(parseInt(number))){
                throwError("console-filters.json Json oject is  incorrect : One of steps children is not a number")
            }
        }
        let steps = json["steps"]
        //check if steps childrens contains good keys
        for(let step in steps){
            if(!steps[step]["filter"] || !steps[step]["params"]|| !steps[step]["next"]){
                throwError("console-filters.json Json oject is  incorrect : One of the steps params is incorrect.You should only use : filter, params and next ")
            }
            //check if the filter, params and next key are associated with string
            if(typeof steps[step]["filter"] !== 'string'){
                throwError("console-filters.json Json oject is  incorrect : One of the steps key associated value is not a string filter");
            }
            else if(typeof steps[step]["params"] !== 'object'){
                console.log(typeof steps[step]["params"])
                throwError("console-filters.json Json oject is  incorrect : One of the steps key associated value is not an array object : params");
            }
            else if(typeof steps[step]["next"] !== 'string'){
                throwError("console-filters.json Json oject is  incorrect : One of the steps key associated value is not a string : next");
            }
        }



}

let checkMaxDepthOfJson = () => {
    let file = fs.readFileSync(path)
    let json = JSON.parse(file);
    let depth =  getDepth(json);
    if(depth >= MAXDEPTHACCEPTED)
        throwError("<<config-filter.json file>> possible object cycle was detected which is not supported ( max :" + MAXDEPTHACCEPTED + ")")
}

// méthode récusrive qui calcule la profondeur d'un array
let getDepth = function (obj) {
    var depth = 0;
    for (let key in obj) {
        if(!obj.hasOwnProperty(key)) continue;
        if(typeof obj[key] == 'object'){
            var tmpDepth = getDepth(obj[key])
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        }

    }


    return 1 + depth
}
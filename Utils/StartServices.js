const path = "config-filters.json";
const fs = require("fs")
let file = fs.readFileSync(path)
let JSONFILE = JSON.parse(file);

const throwError = require("./ThrowError")
module.exports = function StartServices() {
    console.log("-----------------------------------")
    console.log("----------Starting Services--------")
    console.log("-----------------------------------")




    let first = findElelment(JSONFILE,"1");

    //lance les services en recursif
    RunServices(first, first.params);
}

let RunServices = (serviceToRun, params) => {

    console.log("======> Run service : " +serviceToRun.filter);
    try{
        var filter = require("../filters/"+serviceToRun.filter.split(".js")[0])
    }catch(e){
        throwError("Module referred in <<config-filters.json >>   named :" +serviceToRun.filter+"  doesn't appear to exist inside application")
    }

    filter(params);
    console.log("....."+serviceToRun.filter+ "  OK");
    let nextelm = findElelment(JSONFILE, String(serviceToRun.next))
    if(nextelm !== false)
        RunServices(nextelm, nextelm.params);

}


let findElelment = (json, number) =>{
    for (let key in json["steps"]) {
        if (key === number)
            return json["steps"][key]
    }
  return false;
}
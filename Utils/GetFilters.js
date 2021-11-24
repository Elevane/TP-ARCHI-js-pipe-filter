
const fs = require("fs");
const throwError = require("./ThrowError")

const path = "./filters"
module.exports = function GetFilters() {
    console.log("............Checking filter directory..........")
    if (!fs.existsSync(path))
        throwError("no filter directory detected");

    if(isDirEmpty(path))
        console.log("/*** filter directory is empty ***/")
    else{
        // parcours les filters pour vérifier leur validité
        validateFilters();
    }



}

let validateFilters =() => {
    var files = fs.readdirSync(path);
    let validfilters = []
    files.forEach(filter =>{
        let f;
        try {
             f = module.require("."+path+"/"+filter.split(".js")[0])
        }catch (e){
            throwError("the filter : "+ filter + " is not exported well. could not resolve it")
        }
        //si pas de paramètre
        if(f.length === 0)
            throwError("No parameter was declared for the filter : "+ filter)
        //si trop de parametre
        if(f.length > 1)
            throwError("too many parameters were given to the filter : "+filter)
        if(f.input === 0)
            throwError("No parameter was declared for the filter : "+ filter)
        validfilters.push(filter.split(".js")[0] + "\n")
    })
    console.log("valid filters : \n" +validfilters )


}
function isDirEmpty(dirname) {
    return  fs.readdirSync(dirname).length === 0;
}
function moduleAvailable(name) {
    try {
        require.resolve(name);
        return true;
    } catch(e){}
    return false;
}

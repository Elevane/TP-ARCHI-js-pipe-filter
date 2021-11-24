

module.exports = function throwError(error){
    console.log("-----ERROR : " + error);
    process.exit(1);
}

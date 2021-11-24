var CheckFilters = require('./Utils/CheckFilters');
var GetFilters = require('./Utils/GetFilters');
var StartServices = require("./Utils/StartServices")

//check le ficher de config
//read doc inside
CheckFilters();

//chck les fichiers filters
//read doc inside
GetFilters();

//Exécute les filters dans l’ordre défini dans le fichier de configuration par le développeur
StartServices();







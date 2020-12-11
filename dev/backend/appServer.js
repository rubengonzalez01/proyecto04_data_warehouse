//------------------------> Constantes
const PORT = 3000;


//------------------------> Declaracion de dependencias
let express = require('express');
let helmet = require("helmet");
let expressJwt = require('express-jwt');
let service = require("./services/service");
let middle = require("./middlewares/middleware");
let cors = require("cors");

//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------> Instancia del servidor e inicializacion
let server = express();
server.listen( PORT, ()=> console.log("Server started on port "+PORT));


//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------> Configuraciones del servidor
// clave para encriptacion del token
let jwtSecret = "Ba5J@jY}Rtyz(=mpLPm}iNGaB,4$Nx$S";
// instancia de conexion a la base de datos.
let dataService = new service.Service();
let middleware = new middle.Middleware();


const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "*", //servidor que deseo que consuma o (*) en caso que sea acceso libre
                    credentials: true
                }
            ]
        }
    }
}



//------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------> Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(helmet());
server.use(cors( config.application.cors.server ));
server.use(expressJwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: [{ url: "/users/login", methods: ["POST"] }, { url: "/users", methods: ["POST"] }]}));




//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------> Endpoints
// -----------------------> USERS <-------------------------
// Login del usuario
server.post("/users/login", function(req, res){ dataService.login(req,res) });

// Obtiene los usuarios de la aplicacion
server.get("/users", middleware.isAdmin, function(req, res){ dataService.getAllUsers(req,res) });

// Agrega un usuario a la aplicacion
server.post("/users", middleware.isAdmin, middleware.userDataValidate, middleware.userExist, function(req, res){ dataService.addUser(req,res) });

// Modifica los datos de un usuario de la aplicacion
server.put("/users/:username", middleware.isAdmin, middleware.userDataValidate2, function(req, res){ dataService.updateUser(req,res) });

// Hace un soft delete de un usuario de la aplicacion
server.delete("/users/:username", middleware.isAdmin, function(req, res){ dataService.daleteUser(req,res) });

// Efectua una busqueda en base al keyword proporcionado
server.get("/users/:keyword", middleware.isAdmin, function(req, res){ dataService.searchUsersByKeyword(req, res) });



// -----------------------> REGIONS <-------------------------
// Obtiene las regiones activas
server.get("/regions", function(req, res){ dataService.getAllRegions(req,res) });

// Agrega una region
server.post("/regions", middleware.regionDataValidate, function(req, res){ dataService.addRegion(req,res) });

// Modifica los datos de una region
server.put("/regions/:id", middleware.regionDataValidate2, function(req, res){ dataService.updateRegion(req,res) });

// Hace un soft delete de una region
server.delete("/regions/:id", function(req, res){ dataService.daleteRegion(req,res) });



// ----------------------> COUNTRIES <-------------------------
// Obtiene los paises activos
server.get("/countries", function(req, res){ dataService.getAllCountries(req,res) });

// Obtiene los paises activos que pertenezcan a la region indicada
server.get("/countries/region/:id", function(req, res){ dataService.getCountriesByRegionId(req,res) });

// Agrega un pais
server.post("/countries", middleware.countryDataValidate, function(req, res){ dataService.addCountry(req,res) });

// Modifica los datos de un pais
server.put("/countries/:id", middleware.countryDataValidate2, function(req, res){ dataService.updateCountry(req,res) });

// Hace un soft delete de un pais
server.delete("/countries/:id", function(req, res){ dataService.daleteCountry(req,res) });



// ----------------------> CITIES <-------------------------
// Obtiene las ciudades activas
server.get("/cities", function(req, res){ dataService.getAllCities(req,res) });

// Obtiene las ciudades activas que pertenezcan al pais indicado
server.get("/cities/country/:id", function(req, res){ dataService.getCitiesByCountryId(req,res) });

// Agrega una ciudad
server.post("/cities", middleware.cityDataValidate, function(req, res){ dataService.addCity(req,res) });

// Modifica los datos de una ciudad
server.put("/cities/:id", middleware.cityDataValidate2, function(req, res){ dataService.updateCity(req,res) });

// Hace un soft delete de una ciudad
server.delete("/cities/:id", function(req, res){ dataService.daleteCity(req,res) });



// --------------------> COMPANIES <-----------------------
// Obtiene las compañías activas
server.get("/companies", function(req, res){ dataService.getAllCompanies(req,res) });

// Agrega una compañía
server.post("/companies", middleware.companyDataValidate, function(req, res){ dataService.addCompany(req,res) });

// Modifica los datos de una compañía
server.put("/companies/:id", middleware.companyDataValidate2, function(req, res){ dataService.updateCompany(req,res) });

// Hace un soft delete de una compañía
server.delete("/companies/:id", function(req, res){ dataService.daleteCompany(req,res) });



// --------------------> CONTACTS <-----------------------
// Obtiene los usuarios de la aplicacion
server.get("/contacts", function(req, res){ dataService.getAllContacts(req,res) });

// Agrega un usuario a la aplicacion
server.post("/contacts", middleware.contactDataValidate, middleware.contactExist, function(req, res){ dataService.addContact(req,res) });

// Modifica los datos de un usuario de la aplicacion
server.put("/contacts/:id", middleware.contactDataValidate2, function(req, res){ dataService.updateContact(req,res) });

// Hace un soft delete de un usuario de la aplicacion
server.delete("/contacts/:id", function(req, res){ dataService.daleteContact(req,res) });

// Efectua una busqueda en base al keyword proporcionado
server.get("/contacts/:keyword", function(req, res){ dataService.searchContactsByKeyword(req, res) });
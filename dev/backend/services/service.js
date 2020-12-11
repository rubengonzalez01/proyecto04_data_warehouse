//----------------------------------------------------------------------------------------> Constantes
const OK = "ok";
const ERROR = "error";
const SUCCESS = "Success Request";
const BAD_REQ = "Solicitud inválida";
const INVALID_CREDENTIALS = "Usuario o contraseña inválidos"
const NOTFOUND = "Recurso no encontrado"
const SQL_ERROR = "SQL Exception"

let classSchema = require('../schemas/classSchema');
let jwt = require('jsonwebtoken');
const user_mysql = require('../database/user_mysql');
const region_mysql = require('../database/region_mysql');
const country_mysql = require('../database/country_mysql');
const city_mysql = require('../database/city_mysql');
const company_mysql = require('../database/company_mysql');
const contact_mysql = require('../database/contact_mysql');
let userMysql = new user_mysql();
let regionMysql = new region_mysql();
let countryMysql = new country_mysql();
let cityMysql = new city_mysql();
let companyMysql = new company_mysql();
let contactMysql = new contact_mysql();



//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------> Configuraciones del servidor
// clave para encriptacion del token
let jwtSecret = "Ba5J@jY}Rtyz(=mpLPm}iNGaB,4$Nx$S";

userMysql.testConnection();
let response = new classSchema.ResponseModule();


//------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------> Clase Service
class Service{
    constructor(){}

    ////////////////////////////////// USERS /////////////////////////////////////
    //----- Metodo para efectuar el login de un usuario en la app
    async login(req, res){
        let { username, password } = req.body;

        if(!username || !password){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        // obtengo el usuario desde la DB
        let user = await userMysql.selectUserByUsername(username);

        if(user !== SQL_ERROR){
            if(user){
                if(user.password === password){
                    let token = {
                        token: jwt.sign({
                                username: user.username,
                                profile_id: user.profile_id
                                }, jwtSecret, { expiresIn: '1h' }),
                        profileId: user.profile_id,                        
                        firstname: user.firstname,
                        lastname: user.lastname
                    };
        
                    response.setResponse(OK, SUCCESS, token);
                    res.status(200).json(response);
                } else{
                    response.setDefaultResponse(ERROR, INVALID_CREDENTIALS);
                    res.status(401).json(response);
                }
            } else{
                response.setDefaultResponse(ERROR, INVALID_CREDENTIALS);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }


    //----- Metodo para obtener los usuarios de la app
    async getAllUsers(req, res){
        let usersArray = await userMysql.selectUsers();  

        if(usersArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, usersArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para insertar un usuario nuevo 
    async addUser(req, res){
        let { username, firstname, lastname, mail, password, profileId } = req.body;
        let user = new classSchema.User(username, firstname, lastname, mail, password, profileId, true);

        // inserto el usuario en la base de datos
        let result = await userMysql.insertUser(user);
        if(result !== SQL_ERROR){
            response.setDefaultResponse(OK, SUCCESS)
            console.log(response)

            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para actualizar un usuario 
    async updateUser(req, res){
        let username = req.params.username;
        let { firstname, lastname, mail, password, profileId } = req.body;
        let user = new classSchema.User(username, firstname, lastname, mail, password, profileId);

        // actualizo el usuario en la base de datos
        let result = await userMysql.updateUser(user);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para borrar un usuario 
    async daleteUser(req, res){
        let username = req.params.username;

        // borro el usuario en la base de datos
        let result = await userMysql.deleteUser(username);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para obtener los usuarios de la app segun la keyword
    async searchUsersByKeyword(req, res){
        let keyword = req.params.keyword
        let usersArray = await userMysql.selectUsersByKeyword(keyword);  

        if(usersArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, usersArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }


    ////////////////////////////////// REGIONS /////////////////////////////////////
    //----- Metodo para obtener todas las regiones
    async getAllRegions(req, res){
        let regionsArray = await regionMysql.selectRegions();  

        if(regionsArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, regionsArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para agregar una nueva region 
    async addRegion(req, res){
        let { name } = req.body;
        let region = new classSchema.Region(null, name, true);

        // inserto la region en la base de datos
        let result = await regionMysql.insertRegion(region);
        if(result !== SQL_ERROR){
            response.setDefaultResponse(OK, SUCCESS)
            console.log(response)
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para actualizar una region 
    async updateRegion(req, res){
        let id = Number(req.params.id);
        let { name } = req.body;
        let region = new classSchema.Region(id, name, true);

        // actualizo la region en la base de datos
        let result = await regionMysql.updateRegion(region);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para borrar una region 
    async daleteRegion(req, res){
        let id = Number(req.params.id);

        if(id){
            // borro la region en la base de datos
            let result = await regionMysql.deleteRegion(id);
            console.log("result: ", result);
            if(result !== SQL_ERROR){
                if(result){
                    response.setDefaultResponse(OK, SUCCESS);
                    res.status(200).json(response);
                } else{
                    response.setDefaultResponse(ERROR, NOTFOUND);
                    res.status(404).json(response);
                }
            } else{
                response.setDefaultResponse(ERROR, SQL_ERROR);
                res.status(500).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, BAD_REQ);
            res.status(400).json(response);
        }
    }


    ////////////////////////////////// COUNTRIES /////////////////////////////////////
    //----- Metodo para obtener todos los paises
    async getAllCountries(req, res){
        let countriesArray = await countryMysql.selectCountries();  

        if(countriesArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, countriesArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para obtener todos los paises segun su region
    async getCountriesByRegionId(req, res){
        let regionId = Number(req.params.id);
        let countriesArray = await countryMysql.selectCountriesByRegionId(regionId);  

        if(countriesArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, countriesArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para agregar un nuevo pais 
    async addCountry(req, res){
        let { name, regionId } = req.body;
        let country = new classSchema.Country(null, name, Number(regionId), true);

        // inserto un pais en la base de datos
        let result = await countryMysql.insertCountry(country);
        if(result !== SQL_ERROR){
            response.setDefaultResponse(OK, SUCCESS)
            console.log(response)
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para actualizar un pais
    async updateCountry(req, res){
        let id = Number(req.params.id);
        let { name, regionId } = req.body;
        let country = new classSchema.Country(id, name, Number(regionId), true);

        // actualizo el pais en la base de datos
        let result = await countryMysql.updateCountry(country);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(OK, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para borrar un pais
    async daleteCountry(req, res){
        let id = Number(req.params.id);

        if(id){
            // borro un pais en la base de datos
            let result = await countryMysql.deleteCountry(id);
            console.log("result: ", result);
            if(result !== SQL_ERROR){
                if(result){
                    response.setDefaultResponse(OK, SUCCESS);
                    res.status(200).json(response);
                } else{
                    response.setDefaultResponse(OK, NOTFOUND);
                    res.status(404).json(response);
                }
            } else{
                response.setDefaultResponse(ERROR, SQL_ERROR);
                res.status(500).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, BAD_REQ);
            res.status(400).json(response);
        }
    }


    ////////////////////////////////// CITIES /////////////////////////////////////
    //----- Metodo para obtener todas las ciudades
    async getAllCities(req, res){
        let citiesArray = await cityMysql.selectCities();  

        if(citiesArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, citiesArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para obtener todos las ciudades segun su pais
    async getCitiesByCountryId(req, res){
        let countryId = Number(req.params.id);
        let citiesArray = await cityMysql.selectCitiesByCountryId(countryId);  

        if(citiesArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, citiesArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para agregar una nueva ciudad 
    async addCity(req, res){
        let { name, countryId } = req.body;
        let city = new classSchema.City(null, name, Number(countryId), true);

        // inserto la ciudad en la base de datos
        let result = await cityMysql.insertCity(city);
        if(result !== SQL_ERROR){
            response.setDefaultResponse(OK, SUCCESS)
            console.log(response)
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para actualizar una ciudad 
    async updateCity(req, res){
        let id = Number(req.params.id);
        let { name, countryId } = req.body;
        let city = new classSchema.City(id, name, Number(countryId), true);

        // actualizo la ciudad en la base de datos
        let result = await cityMysql.updateCountry(city);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(OK, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para borrar una ciudad 
    async daleteCity(req, res){
        let id = Number(req.params.id);

        if(id){
            // borro la ciudad en la base de datos
            let result = await cityMysql.deleteCity(id);
            console.log("result: ", result);
            if(result !== SQL_ERROR){
                if(result){
                    response.setDefaultResponse(OK, SUCCESS);
                    res.status(200).json(response);
                } else{
                    response.setDefaultResponse(OK, NOTFOUND);
                    res.status(404).json(response);
                }
            } else{
                response.setDefaultResponse(ERROR, SQL_ERROR);
                res.status(500).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, BAD_REQ);
            res.status(400).json(response);
        }
    }


    ////////////////////////////////// COMPANIES /////////////////////////////////////
    //----- Metodo para obtener todas las compañías
    async getAllCompanies(req, res){
        let companiesArray = await companyMysql.selectCompanies();  

        if(companiesArray !== SQL_ERROR){
            response.setResponse(OK, SUCCESS, companiesArray)
            console.log(response)    
            res.status(200).json(response);
        } else{        
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

     //----- Metodo para agregar una nueva compañia 
     async addCompany(req, res){
        let { name, address, phone, mail, cityId } = req.body;
        let company = new classSchema.Company(null, name, address, phone, mail, Number(cityId), true);

        // inserto la compañia en la base de datos
        let result = await companyMysql.insertCompany(company);
        if(result !== SQL_ERROR){
            response.setDefaultResponse(OK, SUCCESS)
            console.log(response)
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para actualizar una ciudad 
    async updateCompany(req, res){
        let id = Number(req.params.id);
        let { name, address, phone, mail, cityId } = req.body;
        let company = new classSchema.Company(id, name, address, phone, mail, Number(cityId), true);

        // actualizo la ciudad en la base de datos
        let result = await companyMysql.updateCompany(company);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(OK, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para borrar una ciudad 
    async daleteCompany(req, res){
        let id = Number(req.params.id);

        if(id){
            // borro la ciudad en la base de datos
            let result = await companyMysql.deleteCompany(id);
            console.log("result: ", result);
            if(result !== SQL_ERROR){
                if(result){
                    response.setDefaultResponse(OK, SUCCESS);
                    res.status(200).json(response);
                } else{
                    response.setDefaultResponse(OK, NOTFOUND);
                    res.status(404).json(response);
                }
            } else{
                response.setDefaultResponse(ERROR, SQL_ERROR);
                res.status(500).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, BAD_REQ);
            res.status(400).json(response);
        }
    }



    ////////////////////////////////// CONTACTS /////////////////////////////////////
    //----- Metodo para obtener los contactos de la app
     async getAllContacts(req, res){
        let contactsArray = await contactMysql.selectContacts();  

        if(contactsArray === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        } 
    
        let contactChannels = [];
        let contactsResponse = [];
        let contact = null;
        console.log("contacts", contactsArray)
        for(let i = 0; i < contactsArray.length; i++){
            // obtiene todos los poductos que conforman cada pedido.
            contactChannels = await contactMysql.selectContactChannels(contactsArray[i].id);
            if(contactChannels === SQL_ERROR){
                response.setDefaultResponse(ERROR, SQL_ERROR);
                return res.status(500).json(response);
            } 
            contact = new classSchema.ResponseContact( contactsArray[i].id, contactsArray[i].firstname, contactsArray[i].lastname, contactsArray[i].position, 
                                            contactsArray[i].mail, contactsArray[i].address, contactsArray[i].interest, contactsArray[i].is_active, 
                                            contactsArray[i].company_id, contactsArray[i].company_name, contactsArray[i].city_id, contactsArray[i].city_name,
                                            contactsArray[i].country_id, contactsArray[i].country_name, contactsArray[i].region_id, contactsArray[i].region_name, contactChannels );
    
            contactsResponse.push(contact);
        }
        response.setResponse(OK, SUCCESS, contactsResponse)
        console.log(response)    
        res.status(200).json(response);
    }



    //----- Metodo para insertar un contacto nuevo 
    async addContact(req, res){
        let { firstname, lastname, position, mail, address, interest, companyId, cityId, contactChannels } = req.body;
        let contact = new classSchema.Contact(null, firstname, lastname, position, mail, address, Number(interest), true, Number(companyId), Number(cityId), contactChannels);
    
        // inserta un nuevo pedido en la base de datos
        let result = await contactMysql.insertContact(contact);
        if(result === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    
        // obtiene el id de la orden creada
        let contactId = await contactMysql.selectMaxContactId();
        if(contactId === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    
        for(let i = 0; i < contactChannels.length; i++ ){
            let content = {
                contactId: Number(contactId),
                contactChannelId: Number(contactChannels[i].contactChannelId),
                preferenceId: Number(contactChannels[i].preferenceId),
                account: contactChannels[i].account
            }
            console.log("content ", content)
            // inserta en la base de datos los canales de contacto que contendrá cada contact
            let cont = await contactMysql.insertContactChannel(content);
            if(cont === SQL_ERROR){
                response.setDefaultResponse(ERROR, SQL_ERROR);
                return res.status(500).json(response);
            }
        }
    
        response.setDefaultResponse(OK, SUCCESS);
        console.log(response)
        return res.status(200).json(response);
    }

    

    //----- Metodo para actualizar un contacto 
    async updateContact(req, res){
        let id = req.params.id;
        let { firstname, lastname, position, mail, address, interest, companyId, cityId, contactChannels } = req.body;
        let contact = new classSchema.Contact(id, firstname, lastname, position, mail, address, Number(interest), true, Number(companyId), Number(cityId), contactChannels);

        // actualizo el contacto en la base de datos
        let result = await contactMysql.updateContact(contact);

        if(result === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
        // verifico los canales de contacto
        if(contactChannels.length > 0){
            let del = await contactMysql.deleteContactChannel(id);
            if(del === SQL_ERROR){
                response.setDefaultResponse(ERROR, SQL_ERROR);
                return res.status(500).json(response);
            }
        }

        for(let i = 0; i < contactChannels.length; i++ ){
            let content = {
                contactId: Number(id),
                contactChannelId: Number(contactChannels[i].contactChannelId),
                preferenceId: Number(contactChannels[i].preferenceId),
                account: contactChannels[i].account
            }
            console.log("content ", content)
            // inserta en la base de datos los canales de contacto que contendrá cada contact
            let cont = await contactMysql.insertContactChannel(content);
            if(cont === SQL_ERROR){
                response.setDefaultResponse(ERROR, SQL_ERROR);
                return res.status(500).json(response);
            }
        }
    
        response.setDefaultResponse(OK, SUCCESS);
        console.log(response)
        return res.status(200).json(response);
    }

    //----- Metodo para borrar un contacto 
    async daleteContact(req, res){
        let id = req.params.id;

        // borro el contacto en la base de datos
        let result = await contactMysql.deleteContact(id);
        console.log("result: ", result);
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    }

    //----- Metodo para obtener los contactos de la app segun la keyword
    async searchContactsByKeyword(req, res){
        let keyword = req.params.keyword
        let contactsArray = await contactMysql.searchContactsByKeyword(keyword);  

        if(contactsArray === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        } 
    
        let contactChannels = [];
        let contactsResponse = [];
        let contact = null;
        console.log("contacts", contactsArray)
        for(let i = 0; i < contactsArray.length; i++){
            // obtiene todos los poductos que conforman cada pedido.
            contactChannels = await contactMysql.selectContactChannels(contactsArray[i].id);
            if(contactChannels === SQL_ERROR){
                response.setDefaultResponse(ERROR, SQL_ERROR);
                return res.status(500).json(response);
            } 
            contact = new classSchema.ResponseContact( contactsArray[i].id, contactsArray[i].firstname, contactsArray[i].lastname, contactsArray[i].position, 
                                            contactsArray[i].mail, contactsArray[i].address, contactsArray[i].interest, contactsArray[i].is_active, 
                                            contactsArray[i].company_id, contactsArray[i].company_name, contactsArray[i].city_id, contactsArray[i].city_name,
                                            contactsArray[i].country_id, contactsArray[i].country_name, contactsArray[i].region_id, contactsArray[i].region_name, contactChannels );
    
            contactsResponse.push(contact);
        }
        response.setResponse(OK, SUCCESS, contactsResponse)
        console.log(response)    
        res.status(200).json(response);
    }

}

module.exports = { Service };
const ERROR = "error";
const NORIGHTS = "Permisos insuficientes"
const EXIST = "El usuario o mail ya existen"
const INVALID_MAIL = "Email inválido"
const BAD_REQ = "Solicitud inválida";
const SQL_ERROR = "Error de SQL"

const PROFILE_CONTACT = 1;
const PROFILE_ADMIN = 2;

let classSchema = require('../schemas/classSchema');
let jwt = require('jsonwebtoken');

const user_mysql = require('../database/user_mysql');
let userMysql = new user_mysql();
const contact_mysql = require('../database/contact_mysql');
let contactMysql = new contact_mysql();

// clave para encriptacion del token
let jwtSecret = "Ba5J@jY}Rtyz(=mpLPm}iNGaB,4$Nx$S";
let response = new classSchema.ResponseModule();

class Middleware{
    constructor(){}
    
    // Metodo que verifica si el usuario logueado es Admin en base a su token
    isAdmin(req, res, next){
        let auth = req.headers.authorization.split(" ");
        let token = auth[1];

        let decoded = jwt.verify(token, jwtSecret);
        console.log(decoded);
        if(decoded.profile_id === PROFILE_ADMIN){
            console.log("is admin")
            return next();
        }
        else{
            response.setDefaultResponse(ERROR, NORIGHTS);
            return res.status(403).json(response);
        }
    }

    // metodo que verifica la existencia de los datos obligatorios
    userDataValidate( req, res, next){
        let { username, firstname, lastname, mail, password } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!username || !firstname || !lastname || !mail || !password){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios, el username lo toma desde el path
    userDataValidate2( req, res, next){
        let username = req.params.username;
        let { firstname, lastname, mail, password } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!username || !firstname || !lastname || !mail || !password){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }



    // metodo para comprobar si el usuario ya se encuentra registrado
    async userExist(req, res, next){
        let { username, mail } = req.body;

        let user = await userMysql.selectUserByParam(username, mail);
        console.log(user)
        if(user !== SQL_ERROR){
            if(user.length){
                response.setDefaultResponse(ERROR, EXIST);
                return res.status(401).json(response);
            } else{
                return next();
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    }

    // metodo que verifica la existencia de los datos obligatorios de la region
    regionDataValidate( req, res, next){
        let { name } = req.body;

        if(!name){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios de la region, con el id obtenido del path
    regionDataValidate2( req, res, next){
        let id = Number(req.params.id);
        let { name } = req.body;

        if(!id || !name){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios del pais
    countryDataValidate( req, res, next){
        let { name, regionId } = req.body;

        if(!name || !Number(regionId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios del pais, con el id obtenido del path
    countryDataValidate2( req, res, next){
        let id = Number(req.params.id);
        let { name, regionId } = req.body;

        if(!id || !name || !Number(regionId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios de la ciudad
    cityDataValidate( req, res, next){
        let { name, countryId } = req.body;

        if(!name || !Number(countryId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios de la ciudad, con el id obtenido del path
    cityDataValidate2( req, res, next){
        let id = Number(req.params.id);
        let { name, countryId } = req.body;

        if(!id || !name || !Number(countryId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios de la compañía
    companyDataValidate( req, res, next){
        let { name, address, phone, mail, cityId } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!name || !address || !phone || !mail || !Number(cityId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios de la compañía
    companyDataValidate2( req, res, next){        
        let id = Number(req.params.id);
        let { name, address, phone, mail, cityId } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!id || !name || !address || !phone || !mail || !Number(cityId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }


     // metodo que verifica la existencia de los datos obligatorios para un contacto
     contactDataValidate( req, res, next){
        let { firstname, lastname, position, mail, address, interest, companyId, cityId } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!firstname || !lastname || !position || !mail || !address || !Number(interest) || !Number(companyId) || !Number(cityId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }

    // metodo que verifica la existencia de los datos obligatorios para un contacto, el id lo toma desde el path
    contactDataValidate2( req, res, next){
        let id = Number(req.params.id);
        let { firstname, lastname, position, mail, address, interest, companyId, cityId } = req.body;

        // regex para la validacion de mail
        let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!id || !firstname || !lastname || !position || !mail || !address || !Number(interest) || !Number(companyId) || !Number(cityId)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }

        if(!regexMail.test(mail)){
            response.setDefaultResponse(ERROR, INVALID_MAIL);
            return res.status(400).json(response);
        }

        return next();    
    }


    // metodo para comprobar si el contacto ya se encuentra registrado
    async contactExist(req, res, next){
        let { mail } = req.body;

        let contact = await contactMysql.selectContactByParam(mail);
        console.log(contact)
        if(contact !== SQL_ERROR){
            if(contact.length){
                response.setDefaultResponse(ERROR, EXIST);
                return res.status(401).json(response);
            } else{
                return next();
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    }

}

module.exports = { Middleware };
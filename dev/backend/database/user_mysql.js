const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }

    async testConnection(){
        // se establece y prueba la coneccion a la base de datos
        await this.sequelize.authenticate().then(() => {
            console.log('Data base connected...')
        }).catch(err => {
            console.error('Connection error: ', err)
            this.sequelize.close();
        });
    }
    

    async selectUsers(){
        this.result = await this.sequelize.query(
                            `SELECT u.username, u.firstname, u.lastname, u.mail, u.password, u.profile_id, p.name as profile_name FROM users u \
                            LEFT JOIN profiles p on p.id = u.profile_id \
                            WHERE u.is_active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectUserByUsername(username){
        this.result = await this.sequelize.query(
                            `SELECT username, firstname, lastname, mail, password, profile_id FROM users 
                            WHERE username = '${username}' 
                            AND is_active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectUserByParam(username, mail){
        this.result = await this.sequelize.query(
                            `SELECT username, firstname, lastname, mail, password, profile_id \
                            FROM users WHERE username = '${username}' OR mail = '${mail}'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectUsersByKeyword(keyword){
        this.result = await this.sequelize.query(
                            `SELECT u.username, u.firstname, u.lastname, u.mail, u.password, u.profile_id, p.name as profile_name 
                            FROM users u \
                            LEFT JOIN profiles p on p.id = u.profile_id\
                            WHERE (username like '%${keyword}%' 
                            OR firstname like '%${keyword}%' 
                            OR lastname like '%${keyword}%')
                            AND is_active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });        

        return this.result;
    }

    async insertUser(user){
        this.result = await this.sequelize.query(
                            `INSERT INTO users(username, firstname, lastname, mail, password, profile_id, is_active) \
                            VALUES('${user.username}', '${user.firstname}', '${user.lastname}', '${user.mail}', '${user.password}', ${user.profileId}, '${user.isActive}')`,
                            { type: this.sequelize.QueryTypes.INSERT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async updateUser( user ){
        this.result = await this.sequelize.query(
                            `UPDATE users SET firstname = '${user.firstname}', lastname = '${user.lastname}', mail = '${user.mail}', password = '${user.password}', profile_id = ${user.profileId} \
                            WHERE username = '${user.username}'`,
                            { type: this.sequelize.QueryTypes.UPDATE }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
                        
        return this.result;
    }

    async deleteUser( username ){
        this.result = await this.sequelize.query(
                            `UPDATE users SET is_active = 'false', delete_date = sysdate() WHERE username = '${username}'`,
                            { type: this.sequelize.QueryTypes.UPDATE }                       
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
                        
        return this.result;
    }

    

}


module.exports = Mysql;


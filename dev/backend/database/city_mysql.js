const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }
    

    async selectCities(){
        this.result = await this.sequelize.query(
                            `SELECT id, name, country_id FROM cities  \
                            WHERE is_active = 'true'`,
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


    async selectCitiesByCountryId( countryId ){
        this.result = await this.sequelize.query(
                            `SELECT ci.id, ci.name, ci.country_id FROM cities ci \
                            LEFT JOIN countries co ON ci.country_id = co.id
                            WHERE ci.is_active = 'true'
                            AND ci.country_id = ${countryId}`,
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


    async insertCity( city ){
        this.result = await this.sequelize.query(
                            `INSERT INTO cities(name, country_id, is_active) \
                            VALUES('${city.name}', ${city.countryId}, '${city.isActive}')`,
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

    async updateCountry( city ){
        this.result = await this.sequelize.query(
                            `UPDATE cities SET name = '${city.name}', country_id = ${city.countryId}  \
                            WHERE id = ${city.id}`,
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

    async deleteCity( id ){
        this.result = await this.sequelize.query(
                            `UPDATE cities SET is_active = 'false', delete_date = sysdate() WHERE id = ${id}`,
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


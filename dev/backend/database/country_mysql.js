const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }
    

    async selectCountries(){
        this.result = await this.sequelize.query(
                            `SELECT id, name, region_id FROM countries  \
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


    async selectCountriesByRegionId( regionId ){
        this.result = await this.sequelize.query(
                            `SELECT c.id, c.name, c.region_id FROM countries c \
                            LEFT JOIN regions r ON c.region_id = r.id
                            WHERE c.is_active = 'true'
                            AND c.region_id = ${regionId}`,
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


    async insertCountry( country ){
        this.result = await this.sequelize.query(
                            `INSERT INTO countries(name, region_id, is_active) \
                            VALUES('${country.name}', ${country.regionId}, '${country.isActive}')`,
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

    async updateCountry( country ){
        this.result = await this.sequelize.query(
                            `UPDATE countries SET name = '${country.name}', region_id = ${country.regionId}  \
                            WHERE id = ${country.id}`,
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

    async deleteCountry( id ){
        this.result = await this.sequelize.query(
                            `UPDATE countries SET is_active = 'false', delete_date = sysdate() WHERE id = ${id}`,
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


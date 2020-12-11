const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }
    

    async selectRegions(){
        this.result = await this.sequelize.query(
                            `SELECT id, name FROM regions  \
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


    async insertRegion( region ){
        this.result = await this.sequelize.query(
                            `INSERT INTO regions(name, is_active) \
                            VALUES('${region.name}', '${region.isActive}')`,
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

    async updateRegion( region ){
        this.result = await this.sequelize.query(
                            `UPDATE regions SET name = '${region.name}' \
                            WHERE id = ${region.id}`,
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

    async deleteRegion( id ){
        this.result = await this.sequelize.query(
                            `UPDATE regions SET is_active = 'false', delete_date = sysdate() WHERE id = ${id}`,
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


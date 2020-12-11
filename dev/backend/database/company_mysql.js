const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }
    

    async selectCompanies(){
        this.result = await this.sequelize.query(
                            `SELECT com.id, com.name, com.address, com.phone, com.mail, cit.id city_id, cit.name city_name, coun.name country_name, reg.name region_name
                            FROM companies com
                            left join cities cit on com.city_id = cit.id
                            left join countries coun on cit.country_id = coun.id
                            left join regions reg on coun.region_id = reg.id
                            WHERE com.is_active = 'true'`,
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


    async insertCompany( company ){
        this.result = await this.sequelize.query(
                            `INSERT INTO companies(name, address, phone, mail, city_id, is_active) \
                            VALUES('${company.name}', '${company.address}', '${company.phone}', '${company.mail}', ${company.cityId}, '${company.isActive}')`,
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

    async updateCompany( company ){
        this.result = await this.sequelize.query(
                            `UPDATE companies SET name = '${company.name}', address = '${company.address}', phone = '${company.phone}', mail = '${company.mail}', city_id = ${company.cityId}  \
                            WHERE id = ${company.id}`,
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

    async deleteCompany( id ){
        this.result = await this.sequelize.query(
                            `UPDATE companies SET is_active = 'false', delete_date = sysdate() WHERE id = ${id}`,
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


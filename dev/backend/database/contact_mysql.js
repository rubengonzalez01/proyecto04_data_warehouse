const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception";
const CONNECTION_STRING = 'mysql://dataware_usr:mysql@localhost:3306/data_warehouse';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }
    

    async selectContacts(){
        this.result = await this.sequelize.query(
                            `SELECT cont.id, cont.firstname, cont.lastname, cont.position, cont.mail, cont.address, cont.interest, cont.is_active, cont.company_id, comp.name company_name, 
                            cont.city_id, city.name city_name, countr.id country_id, countr.name country_name, reg.id region_id, reg.name region_name
                            FROM contacts cont
                            LEFT JOIN companies comp ON cont.company_id = comp.id 
                            LEFT JOIN cities city ON cont.city_id = city.id
                            LEFT JOIN countries countr ON city.country_id = countr.id
                            LEFT JOIN regions reg ON countr.region_id = reg.id
                            WHERE cont.is_active = 'true'`,
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


    async selectContactByParam(mail){
        this.result = await this.sequelize.query(
                            `SELECT id, firstname, lastname, position, mail, address, interest, is_active, company_id, city_id \
                            FROM contacts WHERE mail = '${mail}'`,
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


    async insertContact( contact ){
        this.result = await this.sequelize.query(
                            `INSERT INTO contacts( creation_date, firstname, lastname, position, mail, address, interest, is_active, company_id, city_id) \
                            VALUES( sysdate(), '${contact.firstname}', '${contact.lastname}', '${contact.position}', '${contact.mail}', '${contact.address}', '${contact.interest}', '${contact.isActive}', ${contact.companyId}, ${contact.cityId})`,
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

    async updateContact( contact ){
        this.result = await this.sequelize.query(
                            `UPDATE contacts SET firstname = '${contact.firstname}', lastname = '${contact.lastname}', position = '${contact.position}', mail = '${contact.mail}', address = '${contact.address}',  \
                            interest = '${contact.interest}', company_id =  ${contact.companyId}, city_id = ${contact.cityId}
                            WHERE id = ${contact.id}`,
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

    async deleteContact( id ){
        this.result = await this.sequelize.query(
                            `UPDATE contacts SET is_active = 'false', delete_date = sysdate() WHERE id = ${id}`,
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

    async searchContactsByKeyword(keyword){
        this.result = await this.sequelize.query(
                            `SELECT cont.id, cont.firstname, cont.lastname, cont.position, cont.mail, cont.address, cont.interest, cont.is_active, cont.company_id, comp.name company_name, 
                            cont.city_id, city.name city_name, countr.id country_id, countr.name country_name, reg.id region_id, reg.name region_name
                            FROM contacts cont
                            LEFT JOIN companies comp ON cont.company_id = comp.id 
                            LEFT JOIN cities city ON cont.city_id = city.id
                            LEFT JOIN countries countr ON city.country_id = countr.id
                            LEFT JOIN regions reg ON countr.region_id = reg.id
                            WHERE ( cont.firstname like '%${keyword}%'
                            OR cont.lastname like '%${keyword}%'
                            OR cont.position like '%${keyword}%'
                            OR cont.mail like '%${keyword}%' 
                            OR cont.interest like '%${keyword}%'
                            OR comp.name like '%${keyword}%'
                            OR city.name like '%${keyword}%'
                            OR countr.name like '%${keyword}%'
                            OR reg.name like '%${keyword}%' ) 
                            AND cont.is_active = 'true'`,
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


    async selectContactChannels(contactId){
        this.result = await this.sequelize.query(
                            `SELECT cc.name contact_channel_name, cc.id contact_channel_id, p.name preference_name, p.id preference_id, ccc.account
                            FROM contacts_contact_channels ccc
                            LEFT JOIN contact_channels cc ON ccc.contact_channel_id = cc.id
                            LEFT JOIN preferences p ON ccc.preference_id = p.id
                            WHERE contact_id = ${contactId}`,
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

    async insertContactChannel( cc ){
        this.result = await this.sequelize.query(
                            `INSERT INTO contacts_contact_channels( contact_id, contact_channel_id, preference_id, account) \
                            VALUES( ${cc.contactId}, ${cc.contactChannelId}, ${cc.preferenceId}, '${cc.account}' )`,
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

    async deleteContactChannel( contactId ){
        this.result = await this.sequelize.query(
                            `DELETE FROM contacts_contact_channels
                             WHERE contact_id = ${contactId}`,
                            { type: this.sequelize.QueryTypes.DELETE }
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
    
    async selectMaxContactId(){
        this.result = await this.sequelize.query(
                            `SELECT MAX(id) AS result_id FROM contacts`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0].result_id;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

}


module.exports = Mysql;


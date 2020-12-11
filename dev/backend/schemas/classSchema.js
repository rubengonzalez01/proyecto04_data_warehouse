class ResponseModule {
    constructor(){
       this.header = {
           result: "",
           message: "",
           date: new Date()
       };
       this.data = {};
   }

   setResponse(result, message, data){
       this.header = {
           result: result,
           message: message,
           date: new Date()
       };
       this.data = data
   }

   setDefaultResponse(result, message){
       this.header = {
           result: result,
           message: message,
           date: new Date()
       };
       this.data = {}
   }
}


class User{
    constructor(username, firstname, lastname, mail, password, profileId, isActive){
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.mail = mail;
        this.password = password;
        this.profileId = profileId;
        this.isActive = isActive;
    }
}


class Region{
    constructor(id, name, isActive){
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}


class Country{
    constructor(id, name, regionId, isActive){
        this.id = id;
        this.name = name;
        this.regionId = regionId;
        this.isActive = isActive;
    }
}


class City{
    constructor(id, name, countryId, isActive){
        this.id = id;
        this.name = name;
        this.countryId = countryId;
        this.isActive = isActive;
    }
}


class Company{
    constructor(id, name, address, phone, mail, cityId, isActive){
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.mail = mail;
        this.cityId = cityId;
        this.isActive = isActive;
    }
}


class Contact{
    constructor(id, firstname, lastname, position, mail, address, interest, isActive, companyId, cityId, contactChannels){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.position = position;
        this.mail = mail;
        this.address = address;
        this.interest = interest;
        this.isActive = isActive;
        this.companyId = companyId;
        this.cityId = cityId;
        this.contactChannels = contactChannels;
    }
}

class ResponseContact{
    constructor(id, firstname, lastname, position, mail, address, interest, isActive, companyId, companyName, cityId, cityName, countryId, countryName, regionId, regionName, contactChannels){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.position = position;
        this.mail = mail;
        this.address = address;
        this.interest = interest;
        this.isActive = isActive;
        this.companyId = companyId;
        this.companyName = companyName;        
        this.cityId = cityId;
        this.cityName = cityName;
        this.countryId = countryId;
        this.countryName = countryName;
        this.regionId = regionId;
        this.regionName = regionName;
        this.contactChannels = contactChannels;
    }
}

module.exports = { ResponseModule, User, Region, Country, City, Company, Contact, ResponseContact };
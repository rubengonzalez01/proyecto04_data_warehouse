//-----> Funcion para hacer el llamado al servicio de obtencion de todas las regiones
async function getAllRegionsService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/regions';
    let requestConfig = getRequestConfig(null, 'GET', true);
    
    const response = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log(content.data)
                        return content.data;
                    } else{
                        console.error(content.header.message);
                        return false;
                    }
                })
                .catch(err => { 
                    console.error(err);        
                    expirationSession();
                    return false;
                });
    return response;
}


//-----> Funcion para hacer el llamado al servicio de obtencion de todas los paises
async function getAllCountriesService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/countries';
    let requestConfig = getRequestConfig(null, 'GET', true);
    
    const response = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log(content.data)
                        return content.data;
                    } else{
                        console.error(content.header.message);
                        return false;
                    }
                })
                .catch(err => { 
                    console.error(err);
                    return false;
                });
    return response;
}

//-----> Funcion para hacer el llamado al servicio de obtencion de todas los paises en base a una region
async function getCountriesByRegionIdService(regionId){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/countries/region/${regionId}`;
    let requestConfig = getRequestConfig(null, 'GET', true);
    
    const response = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log(content.data)
                        return content.data;
                    } else{
                        console.error(content.header.message);
                    }
                })
                .catch(err => { console.error(err) });
    return response;
}

//-----> Funcion para hacer el llamado al servicio de obtencion de todas las ciudades
async function getAllCitiesService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/cities';
    let requestConfig = getRequestConfig(null, 'GET', true);
    
    const response = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log(content.data)
                        return content.data;
                    } else{
                        console.error(content.header.message);
                        return false;
                    }
                })
                .catch(err => { 
                    console.error(err);
                    return false;
                });
    return response;
}

//-----> Funcion para hacer el llamado al servicio de obtencion de todas las ciudades en base a un pais
async function getCitiesByCountryIdService(countryId){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/cities/country/${countryId}`;
    let requestConfig = getRequestConfig(null, 'GET', true);
    
    const response = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log(content.data)
                        return content.data;
                    } else{
                        console.error(content.header.message);
                    }
                })
                .catch(err => { console.error(err) });
    return response;
}

//-----> Funcion para hacer el llamado al servicio de eliminar una Region
async function deleteRegionService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/regions/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Region borrada exitosamente")
        } else{
            console.error(content.header.message);
            message = `No se pudo borrar la region. Motivo: ${content.header.message}`
            toggleNotificacionModal(message);
        }
    })
    .catch(err => { console.error(err) });
}


//-----> Funcion para hacer el llamado al servicio de eliminar un Pais
async function deleteCountryService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/countries/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Pais borrada exitosamente")
        } else{
            console.error(content.header.message);
            message = `No se pudo borrar la pais. Motivo: ${content.header.message}`
            toggleNotificacionModal(message);
        }
    })
    .catch(err => { console.error(err) });
}


//-----> Funcion para hacer el llamado al servicio de eliminar una ciudad
async function deleteCityService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/cities/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Ciudad borrada exitosamente")
        } else{
            console.error(content.header.message);
            message = `No se pudo borrar la ciudad. Motivo: ${content.header.message}`
            toggleNotificacionModal(message);
        }
    })
    .catch(err => { console.error(err) });
}


//-----> Funcion para hacer el llamado al servicio de agregar nueva Region
async function addRegionService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/regions';
    let requestConfig = getRequestConfig(data, 'POST', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Región agregada exitosamente")
            message = "Región agregada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar la región. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}

//-----> Funcion para hacer el llamado al servicio de agregar nuevo Pais
async function addCountryService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/countries';
    let requestConfig = getRequestConfig(data, 'POST', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("País agregado exitosamente")
            message = "País agregado exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar el país. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de agregar nueva Ciudad
async function addCityService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/cities';
    let requestConfig = getRequestConfig(data, 'POST', true);
    console.log(data);
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Ciudad agregada exitosamente")
            message = "Ciudad agregada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar la ciudad. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de modificar una Region
async function updateRegionService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/regions/${data.id}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Región actualizada exitosamente")
            message = "Región actualizada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo actualizar la región. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de modificar un País
async function updateCountryService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/countries/${data.id}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("País actualizado exitosamente")
            message = "País actualizado exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo actualizar el país. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de modificar una Ciudad
async function updateCityService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/cities/${data.id}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Ciudad actualizada exitosamente")
            message = "Ciudad actualizada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo actualizar la ciudad. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}
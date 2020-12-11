//-----> Funcion para hacer el llamado al servicio de obtencion de todas las Compañías
async function getAllCompaniesService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/companies';
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
                .catch(err => { 
                    console.error(err) 
                    expirationSession();
                    return false;
                });
    return response;
}


//-----> Funcion para hacer el llamado al servicio de eliminar una Compañía
async function deleteCompanyService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/companies/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    let result = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log("Compañía borrada exitosamente")
                        return true;
                    } else{
                        console.error(content.header.message);
                        message = `No se pudo borrar la compañía. Motivo: ${content.header.message}`
                        toggleNotificacionModal(message);
                        return false;
                    }
                })
                .catch(err => { 
                    console.error(err);        
                    expirationSession();
                    return false;
                });
                
    return result;
}


//-----> Funcion para hacer el llamado al servicio de agregar nueva Compañía
async function addCompanyService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/companies';
    let requestConfig = getRequestConfig(data, 'POST', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Compañía agregada exitosamente")
            message = "Compañía agregada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar la compañía. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { 
        console.error(err) 
        expirationSession();
        return null
    });
    toggleNotificacionModal(message);
}



//-----> Funcion para hacer el llamado al servicio de modificar una Compañía
async function updateCompanyService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/companies/${data.id}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Compañía actualizada exitosamente")
            message = "Compañía actualizada exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo actualizar la compañía. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}
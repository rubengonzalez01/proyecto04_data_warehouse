//-----> Funcion para hacer el llamado al servicio de obtencion de todos los Contactos
async function getAllContactsService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/contacts';
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


//-----> Funcion para hacer el llamado al servicio de eliminar un Contacto
async function deleteContactService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/contacts/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    let result = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log("Contacto borrado exitosamente")
                        return true;
                    } else{
                        console.error(content.header.message);
                        message = `No se pudo borrar el contacto. Motivo: ${content.header.message}`
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


//-----> Funcion para hacer el llamado al servicio de busqueda de contactos segun la keyword ingresada
async function searchContactsService(keyword){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/contacts/${keyword}`;
    
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


//-----> Funcion para hacer el llamado al servicio de agregar nuevo contacto
async function addContactService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/contacts';
    let requestConfig = getRequestConfig(data, 'POST', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Contacto agregado exitosamente")
            message = "Contacto agregado exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar el contacto. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de actualizar contacto
async function updateContactService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/contacts/${data.id}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Contacto modificado exitosamente")
            message = "Contacto modificado exitosamente"
        } else{
            console.error(content.header.message);
            message = `No se pudo modificar el contacto. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}
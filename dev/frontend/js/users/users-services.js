const PROFILE_CONTACT = 1;
const PROFILE_ADMIN = 2;

//-----> Funcion para hacer el llamado al servicio de login
async function loginService(data){
        let spinner = document.getElementById("spinner");
        let inside = document.getElementById("inside");
        let error = document.getElementById("login-error");

        // hago el llamado al endpoint
        const endpoint = SERVER_URL + '/users/login';
        let requestConfig = getRequestConfig(data, 'POST', false);

        await fetch( endpoint, requestConfig )
        .then( response => response.json())
        .then( content => {
            console.log("response: ", content);
            spinner.classList.toggle("disabled");
            inside.classList.toggle("disabled");
            if(content.header.result == "ok"){
                sessionStorage = window.sessionStorage;
                sessionStorage.setItem("userDataWarehouseToken", content.data.token);
                let menuUsers = document.getElementById("option-users");
                if(content.data.profileId !== PROFILE_ADMIN){
                    menuUsers.classList.add("disabled");
                } else{
                    menuUsers.classList.remove("disabled");
                }
                error.classList.add("disabled");
                let fullname = `${content.data.firstname} ${content.data.lastname}`;
                loginSuccess(fullname);
            } else{
                error.innerHTML = content.header.message;
                error.classList.remove("disabled");
                console.log(content.header.message);
            }
        })
        .catch(err => { console.error(err) });
}


//-----> Funcion para hacer el llamado al servicio de agregar nuevo usuario
async function addUserService(data){
    let message = "";
    
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/users';
    let requestConfig = getRequestConfig(data, 'POST', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Usuario creado exitosamente")
            message = "Usuario agregado correctamente."
        } else{
            console.error(content.header.message);
            message = `No se pudo agregar el usuario. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de modificar un usuario
async function updateUserService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/users/${data.username}`;
    let requestConfig = getRequestConfig(data, 'PUT', true);
    
    await fetch( endpoint, requestConfig )
    .then( response => response.json())
    .then( content => {
        console.log("response: ", content);
        if(content.header.result == "ok"){
            console.log("Usuario actualizado exitosamente")
            message = "Usuario actualizado correctamente."
        } else{
            console.error(content.header.message);
            message = `No se pudo actualizar el usuario. Motivo: ${content.header.message}`
        }
    })
    .catch(err => { console.error(err) });
    toggleNotificacionModal(message);
}


//-----> Funcion para hacer el llamado al servicio de eliminar un usuario
async function deleteUserService(data){
    let message = "";
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/users/${data}`;
    let requestConfig = getRequestConfig(null, 'DELETE', true);
    
    let result = await fetch( endpoint, requestConfig )
                .then( response => response.json())
                .then( content => {
                    console.log("response: ", content);
                    if(content.header.result == "ok"){
                        console.log("Usuario borrado exitosamente")
                        return true;
                    } else{
                        console.error(content.header.message);
                        message = `No se pudo borrar el usuario. Motivo: ${content.header.message}`
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



//-----> Funcion para hacer el llamado al servicio de obtencion de todos lo usuarios
async function getAllUsersService(){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + '/users';
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

//-----> Funcion para hacer el llamado al servicio de busqueda de usuarios segun la keyword ingresada
async function searchUsersService(keyword){
    // hago el llamado al endpoint
    const endpoint = SERVER_URL + `/users/${keyword}`;
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




//-----> Funcion para obtener el token desde el session storage
function getToken(){
    sessionStorage = window.sessionStorage;
    let token = 'Bearer ' + sessionStorage.getItem("userDataWarehouseToken");
    return token
}


//-----> Funcion para armar la configuracion de los request http
function getRequestConfig(data, method, needToken){
    let token = "";
    if(needToken === true){
        token = getToken();
    } 
    let config = {
        method: method,
        headers: {
            // vamos a enviar los datos en formato JSON y token de sesion
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: data ? JSON.stringify(data) : null
    }
    return config;
}
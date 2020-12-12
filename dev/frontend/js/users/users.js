const SERVER_URL = 'http://localhost:3000'
// regex para la validacion de mail
const REGEX_MAIL = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;


let operationSpinner = document.getElementById("operation-spinner");

//------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------->  LOGIN
let username = document.getElementById("username");
let password = document.getElementById("password");
let btnLogin = document.getElementById("btn-login");
btnLogin.addEventListener("click", login);
username.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        login();
    }
});
password.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        login();
    }
});


//-----> Funcion para validar y efectuar el login
async function login(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let spinner = document.getElementById("spinner");
    let inside = document.getElementById("inside");
    let error = document.getElementById("login-error");

    spinner.classList.toggle("disabled");
    inside.classList.toggle("disabled");

    if(!username.value || !password.value){
        error.innerHTML = "Ingrese usuario y contraseña";
        username.value = "";
        password.value = "";
        spinner.classList.toggle("disabled");
        inside.classList.toggle("disabled");
        error.classList.remove("disabled");
        return;
    }

    let authenticate = {
        username: username.value,
        password: password.value
    }

    await loginService(authenticate);

    username.value = "";
    password.value = "";
}

//-----> Funcion para cargar la pantalla princital tras el login correcto
function loginSuccess(fullname){
    let core = document.getElementById("core");
    let nav = document.getElementById("nav");
    let login = document.getElementById("login");
    let userFullName = document.getElementById("user-fullname");
    userFullName.textContent = fullname;

    core.classList.remove("disabled");
    nav.classList.remove("disabled");
    btnContacts.click();
    login.classList.add("disabled");
}


//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------>  AGREGAR USUARIO
let btnAddUser = document.getElementById("add-user");
btnAddUser.addEventListener("click", function(){ showUserForm(null) });

let btnCancelAddUser = document.getElementById("cancel-user");
btnCancelAddUser.addEventListener("click", closeAddUser);

let btnCreateUser = document.getElementById("create-user");
btnCreateUser.addEventListener("click", addUser);

/* componentes del formulario de alta */
let inputUsername = document.getElementById("add-user-username");
let inputFirstname = document.getElementById("add-user-firstname");
let inputLastname = document.getElementById("add-user-lastname");
let inputMail = document.getElementById("add-user-mail");
let selectProfile = document.getElementById("add-user-profile");
let inputPass = document.getElementById("add-user-password");
let inputPass2 = document.getElementById("add-user-password2");
inputUsername.addEventListener("focus", () => { inputUsername.classList.add("border-default"); inputUsername.classList.remove("border-no-content");})
inputFirstname.addEventListener("focus", () => { inputFirstname.classList.add("border-default"); inputFirstname.classList.remove("border-no-content");})
inputLastname.addEventListener("focus", () => { inputLastname.classList.add("border-default"); inputLastname.classList.remove("border-no-content");})
inputMail.addEventListener("focus", () => { inputMail.classList.add("border-default"); inputMail.classList.remove("border-no-content");})
inputPass.addEventListener("focus", () => { inputPass.classList.add("border-default"); inputPass.classList.remove("border-no-content");})
inputPass2.addEventListener("focus", () => { inputPass2.classList.add("border-default"); inputPass2.classList.remove("border-no-content");})



//-----> Funcion para abrir el formulario de carga de nuevo usuario
function showUserForm( user ){
    // si no hay un usuario, la accion es un alta de usuario
    let userTitle = document.getElementById("add-user-modal-title");
    backgroundModalsManage();
    if(!user){
        document.getElementById("user-form").reset();
        inputUsername.disabled = false;
        userTitle.textContent = "AGREGAR USUARIO";
        btnCreateUser.classList.remove("disabled");
        btnUpdateUser.classList.add("disabled");
    } else{
        // sino la accion es una modificacion del usuario
        inputUsername.value = user.username;
        inputUsername.disabled = true;
        userTitle.textContent = "MODIFICAR USUARIO";
        inputFirstname.value = user.firstname;
        inputLastname.value = user.lastname;
        inputMail.value = user.mail;
        selectProfile.value = user.profile_id;
        inputPass.value = user.password;
        inputPass2.value = user.password;
        btnUpdateUser.classList.remove("disabled");
        btnCreateUser.classList.add("disabled");
    }
    let addUserModal = document.getElementById("add-user-modal");
    addUserModal.classList.remove("disabled");
}


//-----> Funcion para cerrar el formulario de nuevo usuario
function closeAddUser(){    
    backgroundModalsManage();
    document.getElementById("user-form").reset();
    let addUserModal = document.getElementById("add-user-modal");    
    addUserModal.classList.add("disabled");

    inputUsername.classList.add("border-default"); 
    inputUsername.classList.remove("border-no-content"); 
    inputFirstname.classList.add("border-default"); 
    inputFirstname.classList.remove("border-no-content"); 
    inputLastname.classList.add("border-default"); 
    inputLastname.classList.remove("border-no-content"); 
    inputMail.classList.add("border-default"); 
    inputMail.classList.remove("border-no-content"); 
    inputPass.classList.add("border-default"); 
    inputPass.classList.remove("border-no-content"); 
    inputPass2.classList.add("border-default"); 
    inputPass2.classList.remove("border-no-content"); 
}


//-----> Funcion para efectuar validacion del formulario y llamar al servicio para crear un nuevo usuario
async function addUser(){    

    if(!validateUserForm()){        
        return;
    }        

    let addUserRequest = {
        username: inputUsername.value,
        firstname: inputFirstname.value,
        lastname: inputLastname.value,
        mail: inputMail.value,
        profileId: Number(selectProfile.value),
        password: inputPass.value
    }
    console.log("addUserRequest", addUserRequest)
    operationSpinner.classList.remove("disabled");
    await addUserService(addUserRequest);
    operationSpinner.classList.add("disabled");
    
    closeAddUser();
}

//-----> Funcion para efectuar la validacion del formulario de usuario
function validateUserForm(){
    if(!inputUsername.value || !inputFirstname.value || !inputLastname.value || !inputMail.value || !REGEX_MAIL.test(inputMail.value) || !inputPass.value || !inputPass2.value){
        console.log("Complete los campos obligatorios")
        if(!inputUsername.value){
            inputUsername.classList.remove("border-default");
            inputUsername.classList.add("border-no-content");
        }
        if(!inputFirstname.value){
            inputFirstname.classList.remove("border-default");
            inputFirstname.classList.add("border-no-content");
        }
        if(!inputLastname.value){
            inputLastname.classList.remove("border-default");
            inputLastname.classList.add("border-no-content");
        }
        if(!inputMail.value || !REGEX_MAIL.test(inputMail.value)){
            inputMail.classList.remove("border-default");
            inputMail.classList.add("border-no-content");
        }
        if(!inputPass.value){
            inputPass.classList.remove("border-default");
            inputPass.classList.add("border-no-content");
        }
        if(!inputPass2.value){
            inputPass2.classList.remove("border-default");
            inputPass2.classList.add("border-no-content");
        }
        return false;
    } 

    if(inputPass.value !== inputPass2.value){
        inputPass.classList.remove("border-default");
        inputPass.classList.add("border-no-content");
        inputPass2.classList.remove("border-default");
        inputPass2.classList.add("border-no-content");
        console.log("Los password no coinciden")
        return false;
    }   

    return true;
}

//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------->  OBTENER LISTA DE USUARIOS
let btnRefreshUsers = document.getElementById("refresh-users");
btnRefreshUsers.addEventListener("click", getAllUsers );
let usersArray;

let btnUserPrevious = document.getElementById("users-previous");
let btnUserNext = document.getElementById("users-next");
btnUserPrevious.addEventListener("click", usersPreviousPage );
btnUserNext.addEventListener("click", usersNextPage );


//-----> Funcion para obtener el listado de todos los usuarios activos
async function getAllUsers(){
    cleanUserSearchOptions();
    let usersSearchInput = document.getElementById("users-search-input");
    usersSearchInput.value = "";
    operationSpinner.classList.remove("disabled");
    usersArray = await getAllUsersService();
    operationSpinner.classList.add("disabled");

    if(usersArray){        
        loadUsers(usersArray);  
    }   
}


const usersPageSize = 10;
let usersPageNumber = 1;
let usersPageCont = 0;

//-----> Funcion para efectuar la carga de los usuarios en la tabla
function loadUsers(registers){
    clearUserTableBody();

    usersPageCont = Math.ceil(registers.length / usersPageSize);
    let usersPage = usersPaginate(registers, usersPageSize, usersPageNumber);

    usersPage.forEach(element => {
        // creo cada uno de los registros por usuario existente
        let divRegister = document.createElement("div");
        divRegister.classList.add("table-register");
        divRegister.classList.add("unselected-register");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("users-check");
        divRegister.appendChild(checkbox);

        let divProperties = document.createElement("div");
        divProperties.classList.add("table-properties");
        divProperties.classList.add("five-elements");
        let spanUsername = document.createElement("span");
        let spanLastname = document.createElement("span");
        let spanFirstname = document.createElement("span");
        let spanMail = document.createElement("span");
        let spanProfile = document.createElement("span");

        spanUsername.textContent = element.username;
        spanLastname.textContent = element.lastname;
        spanFirstname.textContent = element.firstname;
        spanMail.textContent = element.mail;
        spanProfile.textContent = element.profile_name;
        divProperties.appendChild(spanUsername);
        divProperties.appendChild(spanLastname);
        divProperties.appendChild(spanFirstname);
        divProperties.appendChild(spanMail);
        divProperties.appendChild(spanProfile);
        divRegister.appendChild(divProperties);
        
        let divActions = document.createElement("div");
        divActions.classList.add("actions-options");
        let btnTrash = document.createElement("button");
        let btnEdit = document.createElement("button");
        btnTrash.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btnTrash.title = "Borrar";
        btnEdit.innerHTML = '<i class="fas fa-user-edit"></i>';
        btnEdit.title = "Editar";
        divActions.appendChild(btnTrash);
        divActions.appendChild(btnEdit);
        divRegister.appendChild(divActions);

        // agrego acciones a los elementos agregados dinamicamente
        btnTrash.addEventListener("click", function(){ showDeleteUserConfirmation(element.username); });
        btnEdit.addEventListener("click", function(){ showUserForm(element) });
        checkbox.addEventListener("change", function(event){ selectedUserRegister( event, divRegister, element) });

        let tableBody = document.getElementById("users-table-body");
        tableBody.appendChild(divRegister);
    });

    // manejo los botones de paginas
    if(usersPageNumber > 1){
        btnUserPrevious.disabled = false;
        btnUserPrevious.classList.add("btn-available");
        btnUserPrevious.classList.remove("btn-unavailable");
    } else{
        btnUserPrevious.disabled = true;
        btnUserPrevious.classList.add("btn-unavailable");
        btnUserPrevious.classList.remove("btn-available");
    }
    if(usersPageNumber < usersPageCont){
        btnUserNext.disabled = false;
        btnUserNext.classList.add("btn-available");
        btnUserNext.classList.remove("btn-unavailable");
    } else {
        btnUserNext.disabled = true;
        btnUserNext.classList.add("btn-unavailable");
        btnUserNext.classList.remove("btn-available");
    }
}

//-----> Funcion para determinar los usuario a cargar en cada pagina
function usersPaginate( array, page_size, page_number ) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

//-----> Funcion para avanzar a la pagina siguiente
function usersNextPage(){
    usersPageNumber ++;
    loadUsers(usersArray);
}

//-----> Funcion para volver a la pagina anterior
function usersPreviousPage(){
    usersPageNumber --;
    loadUsers(usersArray);
}


//-----> Funcion para eliminar los hijos del contenedor de registros de usuarios
function clearUserTableBody(){
    usersMultiCheck.checked = false;
    selectedUsersArray = [];  
    let tableBody = document.getElementById("users-table-body");
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
}


//------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------->  BORRAR UN USUARIO
let usersNo = document.getElementById("users-no");
usersNo.addEventListener("click", closeDeleteUserConfirmation );
let usersYes = document.getElementById("users-yes");
usersYes.addEventListener("click", deleteUser );

let userToDelete = null;


//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showDeleteUserConfirmation(username){    
    backgroundModalsManage();
    usersMultiYes.classList.add("disabled");
    usersYes.classList.remove("disabled");
    let confirmation = document.getElementById("confirmation-user");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-user");
    question.textContent = "¿Estas seguro que deseas borrar el usuario?";
    userToDelete = username;    
}


//-----> Funcion para efectuar el cierre del modal de confirmacion de eliminacion
function closeDeleteUserConfirmation(){
    backgroundModalsManage()
    let confirmation = document.getElementById("confirmation-user");
    confirmation.classList.add("disabled");
}


//-----> Funcion para llamar al servicio de eliminacion del usuario
async function deleteUser(){
    closeDeleteUserConfirmation();
    operationSpinner.classList.remove("disabled");
    let result = await deleteUserService(userToDelete);
    operationSpinner.classList.add("disabled");

    if(result){
        let message = "Se ha borrado el usuario correctamente."
        toggleNotificacionModal(message);
    }    
}


//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------->  BORRAR MULTIPLES USUARIOS
let btnMultiDeleteUser = document.getElementById("multidelete-user");
btnMultiDeleteUser.addEventListener("click", showMultipleDeleteUserConfirmation );

let usersMultiYes = document.getElementById("users-multi-yes");
usersMultiYes.addEventListener("click", multipleDeleteUser );

//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showMultipleDeleteUserConfirmation(){    
    backgroundModalsManage();
    usersMultiYes.classList.remove("disabled");
    usersYes.classList.add("disabled");
    let confirmation = document.getElementById("confirmation-user");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-user");
    question.textContent = `¿Estas seguro que deseas borrar ${selectedUsersArray.length} usuarios?`;     
}


//-----> Funcion para efectuar el borrado multiple de usuarios
async function multipleDeleteUser(){
    closeDeleteUserConfirmation();
    operationSpinner.classList.remove("disabled");
  
    if(selectedUsersArray && selectedUsersArray.length > 0){
        try{
            for(let i = 0; i < selectedUsersArray.length; i++){          
                await deleteUserService(selectedUsersArray[i].username);                           
            }

            operationSpinner.classList.add("disabled");
            selectedUsersArray = [];

            let message = "Se han borrado los usuarios seleccionados."
            toggleNotificacionModal(message);
        } catch{
            let message = "No se han podido borrar los usuarios."
            toggleNotificacionModal(message);
        }
    }
    let multidelete = document.getElementById("multidelete-user");
    multidelete.classList.add("disabled");
}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------->  MODIFICAR UN USUARIO
let btnUpdateUser = document.getElementById("update-user");
btnUpdateUser.addEventListener("click", updateUser );
let userToUpdate = null;

//-----> Funcion para actualizar el usuario
async function updateUser(){

    if(!validateUserForm()){        
        return;
    }        

    let updateUserRequest = {
        username: inputUsername.value,
        firstname: inputFirstname.value,
        lastname: inputLastname.value,
        mail: inputMail.value,
        profileId: Number(selectProfile.value),
        password: inputPass.value
    }
    console.log("addUserRequest", updateUserRequest)
    operationSpinner.classList.remove("disabled");
    console.log("se editara el usuario: "+ inputUsername.value);
    await updateUserService(updateUserRequest);
    operationSpinner.classList.add("disabled");
    
    closeAddUser();    
}





//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------> SELECCION DE REGISTRO
let selectedUsersArray = [];

//-----> Funcion para pintar el registro seleccionado
function selectedUserRegister( event, selected, usuario ){
    let multidelete = document.getElementById("multidelete-user");
    if(event.target.checked){
        selected.classList.add("selected-register");
        selected.classList.remove("unselected-register");
        selectedUsersArray.push(usuario);
        multidelete.classList.remove("disabled");
    } else{
        selected.classList.remove("selected-register");
        selected.classList.add("unselected-register");
        selectedUsersArray.splice( selectedUsersArray.indexOf(usuario), 1)
        if(selectedUsersArray.length === 0){
            multidelete.classList.add("disabled");
        }
    }
    console.log("Usuarios seleccionados", selectedUsersArray)
}



let usersMultiCheck = document.getElementById("users-multicheck");
usersMultiCheck.addEventListener("change", function(event){ toggleUsersMultiSelection(event) })

//-----> Funcion para hacer la seleccion o deseleccion multiple desde el checkbox general
function toggleUsersMultiSelection(ev){
    let checkboxes = document.getElementsByClassName("users-check");
    const e = new Event("change");
    if(ev.target.checked){
        for(let i = 0; i < checkboxes.length; i++){ 
            checkboxes[i].checked = true;
            checkboxes[i].dispatchEvent(e);
        }
    } else{
        for(let i = 0; i < checkboxes.length; i++){ 
            checkboxes[i].checked = false;
            checkboxes[i].dispatchEvent(e);
        }
    }
    
}


//------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------> BUSQUEDA DE USUARIOS
let searchResult = null;
let usersSearchInput = document.getElementById("users-search-input");
let btnUsersSearch = document.getElementById("users-search-button");

btnUsersSearch.addEventListener("click", function(event){ 
    event.preventDefault(); 
    loadSearchResults();
});
usersSearchInput.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        cleanUserSearchOptions();
        loadSearchResults();
    }
    else{
        predictiveSearchUsers();
    }
});


//-----> Funcion para hacer la limpieza del buscador al cargar la pagina
function cleanUserSearchOptions(){
    let autocomplete = document.getElementById("autocomplete");
    let optList = document.getElementsByClassName("user-opcion");
    let hiddenSO = document.getElementsByClassName("users-hidden");
    autocomplete.style.display = "none";
    // por cada keypress elimino el contenido de los label y lo oculto
    for(let j=0; j<optList.length; j++){
        optList[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
}

//-----> Funcion para efectuar la busqueda predictiva de usuarios
async function predictiveSearchUsers(){
    let automplete = document.getElementById("autocomplete");
    if(usersSearchInput.value)
        searchResult = await searchUsersService(usersSearchInput.value);
    else{
        searchResult = null;
    }
    let optList = document.getElementsByClassName("user-opcion");
    let hiddenSO = document.getElementsByClassName("users-hidden");
    // por cada keypress elimino el contenido de los label y lo oculto
    for(let j=0; j<optList.length; j++){
        optList[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
    if(searchResult && searchResult.length > 0){
        automplete.style.display = "flex";
    } else{
        automplete.style.display = "none";
    }
    let i = 0;
    // agregara opciones visibles segun la cantidad de resultados positivos
    while(searchResult && i < searchResult.length && i < optList.length){     
        console.log("opcion de busqueda ", searchResult[i])
        optList[i].innerHTML = `${searchResult[i].firstname} ${searchResult[i].lastname}` ;
        hiddenSO[i].style.display = "flex";
        i++;
    }
}


//-----> Funcion para cargar en la tabla lo resultados de la busqueda
function loadSearchResults(){
    if(searchResult){
        loadUsers(searchResult);
    } else{
        getAllUsers();
    }
}

// agrego el evento click a las opciones de busqueda autocompletadas
let autoOpt = document.getElementsByClassName("user-opcion");
for(let i = 0; i < autoOpt.length ; i++){
    autoOpt[i].addEventListener("click", function(){ addAutocomplete( i ) });
}  


//----- Funcion para copiar en el input search el valor de la opcion de autocompletar seleccionada
function addAutocomplete(index){
    console.log("autocomplete function")   
    usersSearchInput.value = autoOpt[index].innerHTML;
    let hiddenSO = document.getElementsByClassName("users-hidden");
    let automplete = document.getElementById("autocomplete");
    automplete.style.display = "none";
    for(let j=0; j<autoOpt.length; j++){
        autoOpt[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
    // de esta forma solo mostrare el resultado seleccionado y si o si searchResult debe ser un array con un unico objeto
    searchResult = [searchResult[index]];
    loadSearchResults();
}



//------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------->  ORDENAR USUARIOS

let liUserUsername = document.getElementById("liuser-username");
let liUserFirstname = document.getElementById("liuser-firstname");
let liUserLastname = document.getElementById("liuser-lastname");
let liUserMail = document.getElementById("liuser-mail");
let liUserProfile = document.getElementById("liuser-profile");
liUserUsername.addEventListener("click", ()=>{ order === 1 ? sortUsersAsc('username') :  sortUsersDesc('username') });
liUserFirstname.addEventListener("click", ()=>{ order === 1 ? sortUsersAsc('firstname') :  sortUsersDesc('firstname') });
liUserLastname.addEventListener("click", ()=>{ order === 1 ? sortUsersAsc('lastname') :  sortUsersDesc('lastname') });
liUserMail.addEventListener("click", ()=>{ order === 1 ? sortUsersAsc('mail') :  sortUsersDesc('mail') });
liUserProfile.addEventListener("click", ()=>{ order === 1 ? sortUsersAsc('profile_name') :  sortUsersDesc('profile_name') });


//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de manera ascendente
function sortUsersAsc(column){
    usersArray.sort( function(a, b){
        switch (column) {
            case 'username':
                if(a.username > b.username)
                    return 1;
                if(a.username < b.username)
                    return -1;
                return 0;

            case 'firstname':
                if(a.firstname > b.firstname)
                    return 1;
                if(a.firstname < b.firstname)
                    return -1;
                return 0;

            case 'lastname':
                if(a.lastname > b.lastname)
                    return 1;
                if(a.lastname < b.lastname)
                    return -1;
                return 0;

            case 'mail':
                if(a.mail > b.mail)
                    return 1;
                if(a.mail < b.mail)
                    return -1;
                return 0;

            case 'mail':
                if(a.mail > b.mail)
                    return 1;
                if(a.mail < b.mail)
                    return -1;
                return 0;

            case 'profile_name':
                if(a.profile_name > b.profile_name)
                    return 1;
                if(a.profile_name < b.profile_name)
                    return -1;
                return 0;

            default:
                break;
        }
    })
    loadUsers(usersArray);
    order = 2;
}

//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de manera descendente
function sortUsersDesc(column){
    usersArray.sort( function(a, b){
        switch (column) {
            case 'username':
                if(a.username > b.username)
                    return -1;
                if(a.username < b.username)
                    return 1;
                return 0;

            case 'firstname':
                if(a.firstname > b.firstname)
                    return -1;
                if(a.firstname < b.firstname)
                    return 1;
                return 0;

            case 'lastname':
                if(a.lastname > b.lastname)
                    return -1;
                if(a.lastname < b.lastname)
                    return 1;
                return 0;

            case 'country_name':
                if(a.country_name > b.country_name)
                    return -1;
                if(a.country_name < b.country_name)
                    return 1;
                return 0;

            case 'mail':
                if(a.mail > b.mail)
                    return -1;
                if(a.mail < b.mail)
                    return 1;
                return 0;

            case 'profile_name':
                if(a.profile_name > b.profile_name)
                    return -1;
                if(a.profile_name < b.profile_name)
                    return 1;
                return 0;

            default:
                break;
        }
    })
    loadUsers(usersArray);
    order = 1;
}
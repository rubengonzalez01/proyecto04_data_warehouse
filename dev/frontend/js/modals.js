let btnAccept = document.getElementById("notification-accept");
btnAccept.addEventListener("click", ()=>{ toggleNotificacionModal("") });


let btnEndSession = document.getElementById("end-session-accept");
btnEndSession.addEventListener("click", closeSession );


//-----> Funcion para notificar que el tiempo de sesion se encuentra expirado
function expirationSession(){
    btnAccept.classList.add("disabled");
    btnEndSession.classList.remove("disabled");      
    // debugger
    selectedSection = {
        id: 'expirated'
    }
    let message = "Su sesión ha expirado";
    toggleNotificacionModal(message);
}


//-----> Funcion para efectuar el cierre de la sesion del usuario
function closeSession(){
    toggleNotificacionModal("");
    logout(false);
    btnAccept.classList.remove("disabled");
    btnEndSession.classList.add("disabled");
}


//-----> Funcion para mostrar mensaje segun accion tomada y actualizacion de la informacion de cada seccion
function toggleNotificacionModal(message){
    backgroundModalsManage()
    let notificationMsg = document.getElementById("notification-message");
    notificationMsg.textContent = message;

    let notification = document.getElementById("notification");
    notification.classList.toggle("disabled");
    if(!message){
        switch(selectedSection.id){
            case 'users-section': 
                                    getAllUsers();
                                    break;
                                    
            case 'regions-section':
                                    getAllUbications();
                                    break;
            case 'companies-section':
                                    getAllCompanies();
                                    break;
            case 'contacts-section':
                                    getAllContacts();
                                    break;
            default:
                    break;
            
        }
    }
}


//----- Funcion para mostrar el fondo gris trasparente para los modals
function backgroundModalsManage(){
    let backgroundModals = document.getElementById("background-modals");
    let generalContainer = document.getElementById("general-container");
    backgroundModals.style.height = generalContainer.clientHeight + 'px';    
    backgroundModals.classList.toggle("disabled");
}
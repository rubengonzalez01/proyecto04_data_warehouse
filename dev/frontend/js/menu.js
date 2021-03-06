/*************************************************************** */
/************** ACCEDER A LA SECCION USUARIOS ****************** */
let btnUsers = document.getElementById("users-button");
btnUsers.addEventListener("click", function(){ showSection('users') });



/*************************************************************** */
/************** ACCEDER A LA SECCION CONTACTOS ***************** */
let btnContacts = document.getElementById("contacts-button");
btnContacts.addEventListener("click", function(){ showSection('contacts') });



/*************************************************************** */
/************** ACCEDER A LA SECCION COMPAÑÍAS ***************** */
let btnCompanies = document.getElementById("companies-button");
btnCompanies.addEventListener("click", function(){ showSection('companies') });



/*************************************************************** */
/************** ACCEDER A LA SECCION REGIONES ****************** */
let btnRegions = document.getElementById("regions-button");
btnRegions.addEventListener("click", function(){ showSection('regions') });



/*************************************************************** */
/************************ LOGOUT ******************************* */
let btnLogout = document.getElementById("logout-button");
btnLogout.addEventListener("click", verifyLogout);

let logoutYes = document.getElementById("logout-si");
let logoutNo = document.getElementById("logout-no");
logoutYes.addEventListener("click", ()=>{ logout(true) });
logoutNo.addEventListener("click", verifyLogout);



//----- Funcion para verificar si el usuario quiere abandonar la sesion
function verifyLogout(){    
    let logout = document.getElementById("logout");
    backgroundModalsManage();

    logout.classList.toggle("disabled");
}

//----- Funcion para cerrar sesion y se borra el token del session storage
function logout(verify){
    if(verify)
        verifyLogout();
    let core = document.getElementById("core");
    let nav = document.getElementById("nav");
    let login = document.getElementById("login");    

    sessionStorage = window.sessionStorage;
    sessionStorage.removeItem("userDataWarehouseToken");

    core.classList.add("disabled");
    nav.classList.add("disabled");
    login.classList.remove("disabled");
}



/****************************************************************** */
/********************* SECCION SELECCIONADA *********************** */
let selectedSection;


//----- Funcion para hacer el cambio de secciones del menu
async function showSection(selected){
    selectedSection = document.getElementById(`${selected}-section`);

    let contactsSection = document.getElementById("contacts-section");
    let companiesSection = document.getElementById("companies-section");
    let usersSection = document.getElementById("users-section");
    let regionsSection = document.getElementById("regions-section");
    contactsSection.classList.add("disabled");
    companiesSection.classList.add("disabled");
    usersSection.classList.add("disabled");
    regionsSection.classList.add("disabled");

    selectedSection.classList.remove("disabled");

    //dejo los botones por default
    btnUsers.classList.remove("active");
    btnRegions.classList.remove("active");
    btnCompanies.classList.remove("active");
    btnContacts.classList.remove("active");
    btnUsers.classList.add("link");
    btnRegions.classList.add("link");
    btnCompanies.classList.add("link");
    btnContacts.classList.add("link");

    switch(selectedSection.id){
        case 'users-section': 
                                btnUsers.classList.remove("link");
                                btnUsers.classList.add("active");
                                getAllUsers();
                                break;
                                
        case 'regions-section':
                                btnRegions.classList.remove("link");
                                btnRegions.classList.add("active");
                                getAllUbications();
                                break;
        case 'companies-section':
                                btnCompanies.classList.remove("link");
                                btnCompanies.classList.add("active");
                                getAllCompanies();
                                break;
        case 'contacts-section':
                                btnContacts.classList.remove("link");
                                btnContacts.classList.add("active");
                                getAllContacts();
                                break;
        default:
                break;
        
    }
}



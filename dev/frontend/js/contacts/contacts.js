const PHONE = "Teléfono";
const WHAPP = "Whatsapp";
const INSTA = "Instagram";
const FACE = "Facebook";
const LINK = "Linkedin";

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------->  OBTENER LISTA DE CONTACTOS

let btnRefreshContacts = document.getElementById("refresh-contacts");
btnRefreshContacts.addEventListener("click", getAllContacts );

let contactsArray;

let btnContactsPrevious = document.getElementById("contacts-previous");
let btnContactsNext = document.getElementById("contacts-next");
btnContactsPrevious.addEventListener("click", contactsPreviousPage );
btnContactsNext.addEventListener("click", contactsNextPage );


let btnCCAccept= document.getElementById("contact-channel-accept");
btnCCAccept.addEventListener("click", closeConactChannelModal ); 

//-----> Funcion para obtener el listado de todos los usuarios activos
async function getAllContacts(){
    cleanContactSearchOptions();    
    operationSpinner.classList.remove("disabled");
    contactsArray = await getAllContactsService();
    operationSpinner.classList.add("disabled");
    console.log("contacts ", contactsArray)
    
    if(contactsArray){
        loadContacts(contactsArray);
    }
    searchContactResult = contactsArray;
}


const contactsPageSize = 10;
let contactsPageNumber = 1;
let contactsPageCont = 0;


//-----> Funcion para efectuar la carga de los contactos por pantalla y armar la tabla
function loadContacts(registers){
    contactSearchInput.value = "";
    clearContactsTableBody();
    contactsPageCont = Math.ceil(registers.length / contactsPageSize);
    let contactsPage = contactsPaginate(registers, contactsPageSize, contactsPageNumber);

    contactsPage.forEach(element => {
        // creo cada uno de los registros por usuario existente
        let divRegister = document.createElement("div");
        divRegister.classList.add("table-register");
        divRegister.classList.add("unselected-register");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("contacts-check");
        divRegister.appendChild(checkbox);

        let divProperties = document.createElement("div");
        divProperties.classList.add("table-properties");
        divProperties.classList.add("six-elements");

        let divFullname = document.createElement("div");
        let spanFullname = document.createElement("span");
        let spanMail = document.createElement("span");
        spanMail.classList.add("subtext");
        divFullname.appendChild(spanFullname);
        divFullname.appendChild(spanMail);

        let divRegion = document.createElement("div");
        let spanCountry = document.createElement("span");
        let spanRegion = document.createElement("span");
        spanRegion.classList.add("subtext");
        divRegion.appendChild(spanCountry);
        divRegion.appendChild(spanRegion);

        let spanCompany = document.createElement("span");
        let spanPosition = document.createElement("span");

        let divContactChannels = document.createElement("div");
        divContactChannels.classList.add("contact-channels");
        for(let i = 0 ; i < element.contactChannels.length; i++){
            let btnChannel = document.createElement("button");            
            switch(element.contactChannels[i].contact_channel_name){
                case PHONE:
                    btnChannel.innerHTML = '<i class="fas fa-phone-square-alt"></i>';
                    btnChannel.title = PHONE;                    
                    break;
                case WHAPP:
                    btnChannel.innerHTML = '<i class="fab fa-whatsapp-square"></i>';
                    btnChannel.title = WHAPP;
                    break;
                case INSTA:
                    btnChannel.innerHTML = '<i class="fab fa-instagram-square"></i>';
                    btnChannel.title = INSTA;
                    break;
                case FACE:
                    btnChannel.innerHTML = '<i class="fab fa-facebook-square"></i>';
                    btnChannel.title = FACE;
                    break;
                case LINK:
                    btnChannel.innerHTML = '<i class="fab fa-linkedin"></i>';
                    btnChannel.title = LINK;
                    break;
                default:
                    break;
            }
            btnChannel.addEventListener("click", function(){ showContactChannelModal(element.contactChannels[i]) });
            divContactChannels.appendChild(btnChannel);
        }

        let divInterest = document.createElement("div");
        let divInterestBar = document.createElement("div");
        divInterestBar.classList.add("interest-bar");
        let divInterestColor = document.createElement("div");
        let spanInterest = document.createElement("span");
        spanInterest.textContent = element.interest + '%';
        switch(Number(element.interest)){
            case 25: 
                divInterestColor.classList.add("color25");
                break;
            case 50: 
                divInterestColor.classList.add("color50");
                break;
            case 75: 
                divInterestColor.classList.add("color75");
                break;
            case 100: 
                divInterestColor.classList.add("color100");
                break;
            default:
                break;
        }
        divInterestBar.appendChild(divInterestColor);
        divInterest.appendChild(spanInterest);
        divInterest.appendChild(divInterestBar);

        spanFullname.textContent = `${element.firstname} ${element.lastname}`;
        spanMail.textContent = element.mail;
        spanCountry.textContent = element.countryName;
        spanRegion.textContent = element.regionName;
        spanCompany.textContent = element.companyName;
        spanPosition.textContent = element.position;
        divProperties.appendChild(divFullname);
        divProperties.appendChild(divRegion);
        divProperties.appendChild(spanCompany);
        divProperties.appendChild(spanPosition);
        divProperties.appendChild(divContactChannels);
        divProperties.appendChild(divInterest);
        divRegister.appendChild(divProperties);
        
        let divActions = document.createElement("div");
        divActions.classList.add("actions-options");
        let btnTrash = document.createElement("button");
        let btnEdit = document.createElement("button");
        btnTrash.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btnTrash.title = "Borrar";
        btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
        btnEdit.title = "Editar";
        divActions.appendChild(btnTrash);
        divActions.appendChild(btnEdit);
        divRegister.appendChild(divActions);

        // agrego acciones a los elementos agregados dinamicamente
        btnTrash.addEventListener("click", function(){ showDeleteContactConfirmation(element.id); });
        btnEdit.addEventListener("click", function(){ showContactForm(element) });
        checkbox.addEventListener("change", function(event){ selectedContactRegister( event, divRegister, element) });

        let tableBody = document.getElementById("contacts-table-body");
        tableBody.appendChild(divRegister);
    });

    // manejo los botones de paginas
    if(contactsPageNumber > 1){
        btnContactsPrevious.disabled = false;
        btnContactsPrevious.classList.add("btn-available");
        btnContactsPrevious.classList.remove("btn-unavailable");
    } else{
        btnContactsPrevious.disabled = true;
        btnContactsPrevious.classList.add("btn-unavailable");
        btnContactsPrevious.classList.remove("btn-available");
    }
    if(contactsPageNumber < contactsPageCont){
        btnContactsNext.disabled = false;
        btnContactsNext.classList.add("btn-available");
        btnContactsNext.classList.remove("btn-unavailable");
    } else {
        btnContactsNext.disabled = true;
        btnContactsNext.classList.add("btn-unavailable");
        btnContactsNext.classList.remove("btn-available");
    }
}

//-----> Funcion para establecer los contactos que se mostraran por pagina
function contactsPaginate( array, page_size, page_number ) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
//-----> Funcion para avanzar a la siguiente pagina de la tabla
function contactsNextPage(){
    contactsPageNumber ++;
    loadContacts(contactsArray);
}
//-----> Funcion para volver a la pagina anterior
function contactsPreviousPage(){
    contactsPageNumber --;
    loadContacts(contactsArray);
}


//-----> Funcion para eliminar los hijos del contenedor de registros de contactos
function clearContactsTableBody(){
    // contactsMultiCheck.checked = false;    
    // selectedContactsArray = [];
    let tableBody = document.getElementById("contacts-table-body");
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
}


//-----> Funcion para mostrar el modal que muestra el canal de conectado para el contacto seleccionado
function showContactChannelModal( cc ){
    backgroundModalsManage();
    let ccModal = document.getElementById("contact-channel-modal");
    let ccPreference = document.getElementById("contact-channel-modal-preference");
    let ccAccount = document.getElementById("contact-channel-modal-account");
    let ccTitle = document.getElementById("contact-channel-modal-title");
    ccPreference.value = cc.preference_name;
    ccAccount.value = cc.account;
    ccTitle.textContent = cc.contact_channel_name;
    ccModal.classList.remove("disabled");
}


//-----> Funcion para cerrar el modal que muestra el canal de contacto
function closeConactChannelModal(){
    backgroundModalsManage();
    let ccModal = document.getElementById("contact-channel-modal");
    ccModal.classList.add("disabled");
}



//------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------->  BORRAR UN CONTACTO
let contactNo = document.getElementById("contact-no");
contactNo.addEventListener("click", closeDeleteContactConfirmation );
let contactYes = document.getElementById("contact-yes");
contactYes.addEventListener("click", deleteContact );

let contactToDelete = null;

//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showDeleteContactConfirmation(contact_id){    
    backgroundModalsManage();
    //contactMultiYes.classList.add("disabled");
    contactYes.classList.remove("disabled");
    let confirmation = document.getElementById("confirmation-contact");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-contact");
    question.textContent = "¿Estas seguro que deseas borrar el contacto?";
    contactToDelete = contact_id;    
}


//-----> Funcion para efectuar el cierre del modal de confirmacion de eliminacion
function closeDeleteContactConfirmation(){
    backgroundModalsManage()
    let confirmation = document.getElementById("confirmation-contact");
    confirmation.classList.add("disabled");
}


//-----> Funcion para llamar al servicio de eliminacion de compañia
async function deleteContact(){
    closeDeleteContactConfirmation();
    operationSpinner.classList.remove("disabled");
    let result = await deleteContactService(contactToDelete);
    operationSpinner.classList.add("disabled");

    if(result){
        let message = "El contacto fue borrado exitosamente";
        toggleNotificacionModal(message);
    }
    
}


//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------->  BORRAR MULTIPLES CONTACTOS

let btnMultiDeleteContact = document.getElementById("multidelete-contact");
btnMultiDeleteContact.addEventListener("click", showMultipleDeleteContactConfirmation );

let contactMultiYes = document.getElementById("contact-multi-yes");
contactMultiYes.addEventListener("click", multipleDeleteContact );


//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showMultipleDeleteContactConfirmation(){    
    backgroundModalsManage();
    contactMultiYes.classList.remove("disabled");
    contactYes.classList.add("disabled");
    let confirmation = document.getElementById("confirmation-contact");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-contact");
    question.textContent = `¿Estas seguro que deseas borrar ${selectedContactArray.length} contactos?`;     
}


//-----> Funcion para sefectuar el borrado multiple de registros
async function multipleDeleteContact(){
    closeDeleteContactConfirmation();
    operationSpinner.classList.remove("disabled");
  
    if(selectedContactArray && selectedContactArray.length > 0){
        try{
            for(let i = 0; i < selectedContactArray.length; i++){          
                await deleteContactService(selectedContactArray[i].id);                           
            }

            operationSpinner.classList.add("disabled");
            console.log("selectedContactArray ", selectedContactArray)

            let message = "Se han borrado los contactos seleccionados";
            toggleNotificacionModal(message);
        } catch{
            let message = "No se han podido borrar los contactos seleccionados";
            toggleNotificacionModal(message);
        }
    }
    let multidelete = document.getElementById("multidelete-contact");
    multidelete.classList.add("disabled");
}



//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------> SELECCION DE REGISTRO
let selectedContactArray = [];

//-----> Funcion para pintar el registro seleccionado
function selectedContactRegister( event, selected, contact ){
    let multidelete = document.getElementById("multidelete-contact");
    if(event.target.checked){
        selected.classList.add("selected-register");
        selected.classList.remove("unselected-register");
        selectedContactArray.push(contact);
        multidelete.classList.remove("disabled");
    } else{
        selected.classList.remove("selected-register");
        selected.classList.add("unselected-register");
        selectedContactArray.splice( selectedContactArray.indexOf(contact), 1)
        if(selectedContactArray.length === 0){
            multidelete.classList.add("disabled");
        }
    }
    console.log("Contactos seleccionados", selectedContactArray)
}



let contactsMultiCheck = document.getElementById("contacts-multicheck");
contactsMultiCheck.addEventListener("change", function(event){ toggleContactsMultiSelection(event) })


//-----> Funcion para seleccionar o deseleccionar multiples registros cuando el checkbox general cambia
function toggleContactsMultiSelection(ev){
    let checkboxes = document.getElementsByClassName("contacts-check");
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
//-------------------------------------------------------------------------------> BUSQUEDA DE CONTACTOS
let searchContactResult = null;
let contactSearchInput = document.getElementById("contacts-search-input");
let btnContactsSearch = document.getElementById("contacts-search-button");

btnContactsSearch.addEventListener("click", function(event){ 
    event.preventDefault(); 
    loadContactSearchResults();
});
contactSearchInput.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        
        cleanContactSearchOptions();
        loadContactSearchResults();
    }
    else{
        predictiveSearchContacts();
    }
});


//-----> Funcion para efectuar la limpieza del buscador de contactos
function cleanContactSearchOptions(){    
    let optList = document.getElementsByClassName("contact-opcion");
    let hiddenSO = document.getElementsByClassName("contact-hidden");
    let autocomplete = document.getElementById("autocomplete2");
    autocomplete.style.display = "none";
    // por cada keypress elimino el contenido de los label y lo oculto
    for(let j=0; j<optList.length; j++){
        optList[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
}

//-----> Funcion para busqueda predictiva, muestra resultados segun los valores encontrados
async function predictiveSearchContacts(){
    let autocomplete = document.getElementById("autocomplete2");
    console.log("valor de busqueda", contactSearchInput.value)
    if(contactSearchInput.value)
        searchContactResult = await searchContactsService(contactSearchInput.value);
    else{
        searchContactResult = null;
    }
    let optList = document.getElementsByClassName("contact-opcion");
    let hiddenSO = document.getElementsByClassName("contact-hidden");
    // por cada keypress elimino el contenido de los label y lo oculto
    for(let j=0; j<optList.length; j++){
        optList[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
    if(searchContactResult && searchContactResult.length > 0){
        autocomplete.style.display = "flex";
    } else{
        autocomplete.style.display = "none";
    }
    let i = 0;
    // agregara opciones visibles segun la cantidad de resultados positivos
    while(searchContactResult && i < searchContactResult.length && i < optList.length){     
        console.log("opcion de busqueda ", searchContactResult[i])
        
        optList[i].innerHTML = getResultsTypes(searchContactResult[i]);
        if(optList[i].innerHTML !== "")
            hiddenSO[i].style.display = "flex";
        i++;
    }
}


//-----> Funcion para eliminar los acentos en las busquedas
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 


//-----> Funcion para ir mostranado los resultados predictivos segun el campo encontrado
function getResultsTypes( contact ){
    let result = "";
    if(contact.firstname.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>Nombre: ${contact.firstname}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;        
    }
    if(contact.lastname.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>Apellido: ${contact.lastname}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(contact.position.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>Cargo: ${contact.position}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(contact.mail.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>Email: ${contact.mail}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(String(contact.interest).includes(contactSearchInput.value)){
        result = `<span>Interes: ${contact.interest}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(removeAccents(contact.companyName).toLowerCase().includes(removeAccents(contactSearchInput.value).toLowerCase())){
        result = `<span>Compañía: ${contact.companyName}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(contact.cityName.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>Ciudad: ${contact.cityName}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(contact.countryName.toLowerCase().includes(contactSearchInput.value.toLowerCase())){
        result = `<span>País: ${contact.countryName}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    if(removeAccents(contact.regionName).toLowerCase().includes(removeAccents(contactSearchInput.value).toLowerCase())){
        result = `<span>Región: ${contact.regionName}</span>&nbsp;| ${contact.firstname} ${contact.lastname}`;
    }
    console.log(result)
    return result;
}

let flagSearch = false;

//-----> Funcion para cargar en la tabla los resultados de la busqueda
async function loadContactSearchResults(){    
    if(!flagSearch){
        searchContactResult = await searchContactsService(contactSearchInput.value);
    }
    
    if(searchContactResult){
        loadContacts(searchContactResult);
        flagSearch = false;
    } else{
        getAllContacts();
    }
}

// agrego el evento click a las opciones de busqueda autocompletadas
let contactOpt = document.getElementsByClassName("contact-opcion");
for(let i = 0; i < contactOpt.length ; i++){
    contactOpt[i].addEventListener("click", function(){ addContactAutocomplete( i ) });
}  


//----- Funcion para copiar en el input search el valor de la opcion de autocompletar seleccionada
function addContactAutocomplete(index){
    console.log("autocomplete function")   
    let aux = contactOpt[index].innerHTML.split('|');
    contactSearchInput.value = aux[1];
    let hiddenSO = document.getElementsByClassName("contact-hidden");
    let autocomplete = document.getElementById("autocomplete2");
    autocomplete.style.display = "none";
    for(let j=0; j<contactOpt.length; j++){
        contactOpt[j].innerHTML = "";
        hiddenSO[j].style.display = "none";
    }
    // de esta forma solo mostrare el resultado seleccionado y si o si searchContactResult debe ser un array con un unico objeto
    searchContactResult = [searchContactResult[index]];
    flagSearch = true;
    loadContactSearchResults();
}




//------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------->  AGREGAR CONTACTO
let btnAddContact = document.getElementById("add-contact");
btnAddContact.addEventListener("click", function(){ showContactForm(null) });

let btnCancelAddContact = document.getElementById("cancel-contact");
btnCancelAddContact.addEventListener("click", closeContactForm);

let btnCreateContact = document.getElementById("create-contact");
btnCreateContact.addEventListener("click", addContact);

/* componentes del formulario de alta */
let inputContactName = document.getElementById("add-contact-name");
let inputContactLastname = document.getElementById("add-contact-lastname");
let inputContactPosition = document.getElementById("add-contact-position");
let inputContactMail = document.getElementById("add-contact-mail");
let inputContactCompany = document.getElementById("add-contact-company");
let inputContactRegion = document.getElementById("add-contact-region");
let inputContactCountry = document.getElementById("add-contact-country");
let inputContactCity = document.getElementById("add-contact-city");
let inputContactAddress = document.getElementById("add-contact-address");
let inputContactInterest = document.getElementById("add-contact-interest");
let inputContactChannel1 = document.getElementById("add-contact-channel-1");
let inputContactChannel2 = document.getElementById("add-contact-channel-2");
let inputContactChannel3 = document.getElementById("add-contact-channel-3");
let inputContactChannel4 = document.getElementById("add-contact-channel-4");
let inputContactChannel5 = document.getElementById("add-contact-channel-5");
let inputContactAccount1 = document.getElementById("add-contact-account-1");
let inputContactAccount2 = document.getElementById("add-contact-account-2");
let inputContactAccount3 = document.getElementById("add-contact-account-3");
let inputContactAccount4 = document.getElementById("add-contact-account-4");
let inputContactAccount5 = document.getElementById("add-contact-account-5");
let inputContactPreference1 = document.getElementById("add-contact-preference-1");
let inputContactPreference2 = document.getElementById("add-contact-preference-2");
let inputContactPreference3 = document.getElementById("add-contact-preference-3");
let inputContactPreference4 = document.getElementById("add-contact-preference-4");
let inputContactPreference5 = document.getElementById("add-contact-preference-5");
inputContactName.addEventListener("focus", () => { inputContactName.classList.add("border-default"); inputContactName.classList.remove("border-no-content");})
inputContactLastname.addEventListener("focus", () => { inputContactLastname.classList.add("border-default"); inputContactLastname.classList.remove("border-no-content");})
inputContactPosition.addEventListener("focus", () => { inputContactPosition.classList.add("border-default"); inputContactPosition.classList.remove("border-no-content");})
inputContactMail.addEventListener("focus", () => { inputContactMail.classList.add("border-default"); inputContactMail.classList.remove("border-no-content");})
inputContactCompany.addEventListener("focus", () => { inputContactCompany.classList.add("border-default"); inputContactCompany.classList.remove("border-no-content");})
inputContactRegion.addEventListener("focus", () => { inputContactRegion.classList.add("border-default"); inputContactRegion.classList.remove("border-no-content");})
inputContactCountry.addEventListener("focus", () => { inputContactCountry.classList.add("border-default"); inputContactCountry.classList.remove("border-no-content");})
inputContactCity.addEventListener("focus", () => { inputContactCity.classList.add("border-default"); inputContactCity.classList.remove("border-no-content");})
inputContactAddress.addEventListener("focus", () => { inputContactAddress.classList.add("border-default"); inputContactAddress.classList.remove("border-no-content");})

inputContactChannel1.addEventListener("focus", () => { inputContactChannel1.classList.add("border-default"); inputContactChannel1.classList.remove("border-no-content");})
inputContactChannel2.addEventListener("focus", () => { inputContactChannel2.classList.add("border-default"); inputContactChannel2.classList.remove("border-no-content");})
inputContactChannel3.addEventListener("focus", () => { inputContactChannel3.classList.add("border-default"); inputContactChannel3.classList.remove("border-no-content");})
inputContactChannel4.addEventListener("focus", () => { inputContactChannel4.classList.add("border-default"); inputContactChannel4.classList.remove("border-no-content");})
inputContactChannel5.addEventListener("focus", () => { inputContactChannel5.classList.add("border-default"); inputContactChannel5.classList.remove("border-no-content");})
inputContactAccount1.addEventListener("focus", () => { inputContactAccount1.classList.add("border-default"); inputContactAccount1.classList.remove("border-no-content");})
inputContactAccount2.addEventListener("focus", () => { inputContactAccount2.classList.add("border-default"); inputContactAccount2.classList.remove("border-no-content");})
inputContactAccount3.addEventListener("focus", () => { inputContactAccount3.classList.add("border-default"); inputContactAccount3.classList.remove("border-no-content");})
inputContactAccount4.addEventListener("focus", () => { inputContactAccount4.classList.add("border-default"); inputContactAccount4.classList.remove("border-no-content");})
inputContactAccount5.addEventListener("focus", () => { inputContactAccount5.classList.add("border-default"); inputContactAccount5.classList.remove("border-no-content");})
inputContactPreference1.addEventListener("focus", () => { inputContactPreference1.classList.add("border-default"); inputContactPreference1.classList.remove("border-no-content");})
inputContactPreference2.addEventListener("focus", () => { inputContactPreference2.classList.add("border-default"); inputContactPreference2.classList.remove("border-no-content");})
inputContactPreference3.addEventListener("focus", () => { inputContactPreference3.classList.add("border-default"); inputContactPreference3.classList.remove("border-no-content");})
inputContactPreference4.addEventListener("focus", () => { inputContactPreference4.classList.add("border-default"); inputContactPreference4.classList.remove("border-no-content");})
inputContactPreference5.addEventListener("focus", () => { inputContactPreference5.classList.add("border-default"); inputContactPreference5.classList.remove("border-no-content");})


// seleccionar una ubicacion y habilitar otro select
inputContactRegion.addEventListener("change", ()=>{ getUbication(1) });
inputContactCountry.addEventListener("change", ()=>{ getUbication(2) });
inputContactCity.addEventListener("change", ()=>{ getUbication(3) });
// canales de contacto
inputContactChannel1.addEventListener("change", ()=>{ setContactChannel(1) });
inputContactChannel2.addEventListener("change", ()=>{ setContactChannel(2) });
inputContactChannel3.addEventListener("change", ()=>{ setContactChannel(3) });
inputContactChannel4.addEventListener("change", ()=>{ setContactChannel(4) });
inputContactChannel5.addEventListener("change", ()=>{ setContactChannel(5) });



let check1 = document.getElementById("channel-check-1");
let check2 = document.getElementById("channel-check-2");
let check3 = document.getElementById("channel-check-3");
let check4 = document.getElementById("channel-check-4");
let check5 = document.getElementById("channel-check-5");

check1.addEventListener("change", (e)=>{ toggleContactChannel(e, 1) });
check2.addEventListener("change", (e)=>{ toggleContactChannel(e, 2) });
check3.addEventListener("change", (e)=>{ toggleContactChannel(e, 3) });
check4.addEventListener("change", (e)=>{ toggleContactChannel(e, 4) });
check5.addEventListener("change", (e)=>{ toggleContactChannel(e, 5) });


//----- Funcion para permitir el agregado de un canal de contacto desde el formulario, si está con el check activo permite agregar uno
function toggleContactChannel(event, id){
    if(event.target.checked){
        switch (id) {
            case 1:
                inputContactChannel1.disabled = false;
                break;
            case 2:
                inputContactChannel2.disabled = false;
                break;
            case 3:
                inputContactChannel3.disabled = false;
                break;
            case 4:
                inputContactChannel4.disabled = false;
                break;
            case 5:
                inputContactChannel5.disabled = false;
                break;
            default:
                break;
        }
    } else{
        switch (id) {
            case 1:
                inputContactChannel1.disabled = true;
                inputContactAccount1.disabled = true;
                inputContactPreference1.disabled = true;
                break;
            case 2:
                inputContactChannel2.disabled = true;
                inputContactAccount2.disabled = true;
                inputContactPreference2.disabled = true;
                break;
            case 3:
                inputContactChannel3.disabled = true;
                inputContactAccount3.disabled = true;
                inputContactPreference3.disabled = true;
                break;
            case 4:
                inputContactChannel4.disabled = true;
                inputContactAccount4.disabled = true;
                inputContactPreference4.disabled = true;
                break;
            case 5:
                inputContactChannel5.disabled = true;
                inputContactAccount5.disabled = true;
                inputContactPreference5.disabled = true;
                break;
            default:
                break;
        }
    }
}

//-----> Funcion para detectar un cambio en los select de ubicaciones, y habilitar la siguiente opcion a seleccionar
async function getUbication(UbicationType){
    console.log("ubicacion seleccionada ", UbicationType)
    
    switch(UbicationType){
        // si el type es 1, se ha seleccionado una region, por lo tanto se buscan los paises pertenecientes a la region seleccionada
        case 1:
            if(inputContactRegion.value != 0){
                inputContactCountry.disabled = true;
                inputContactCity.disabled = true;
                inputContactAddress.disabled = true;
               clearSelectChild(inputContactCountry);
                let countries = await getCountriesByRegionIdService(Number(inputContactRegion.value))
                console.log("countries", countries)
                if(countries.length){
                    countries.sort( sortArray );
                    let defaultOption = document.createElement("option");
                    defaultOption.value = 0;
                    defaultOption.textContent = "Seleccione un pais";
                    defaultOption.hidden = true;
                    defaultOption.selected = true;
                    inputContactCountry.appendChild(defaultOption);
                    countries.forEach( country => {
                        let option = document.createElement("option");
                        option.value = country.id;
                        option.textContent = country.name;
                        inputContactCountry.appendChild(option);
                    });                
                    inputContactCountry.disabled = false;
                } else{
                    console.log("No hay paises disponibles")                
                } 
            }
            break;
        // si el type es 2, se ha seleccionado un pais, por lo tanto se buscan las ciudades pertenecientes al pais seleccionado
        case 2:
            if(inputContactCountry.value != 0){
                inputContactCity.disabled = true;
                inputContactAddress.disabled = true;
                clearSelectChild(inputContactCity);
                let cities = await getCitiesByCountryIdService(Number(inputContactCountry.value))
                console.log("cities", cities)
                if(cities.length){
                    cities.sort( sortArray );
                    let defaultOption = document.createElement("option");
                    defaultOption.value = 0;
                    defaultOption.textContent = "Seleccione una ciudad";
                    defaultOption.hidden = true;
                    defaultOption.selected = true;
                    inputContactCity.appendChild(defaultOption);
                    cities.forEach( city => {
                        let option = document.createElement("option");
                        option.value = city.id;
                        option.textContent = city.name;
                        inputContactCity.appendChild(option);
                    });                
                    inputContactCity.disabled = false;
                } else{
                    console.log("No hay paises disponibles")                
                }
            }
            break;
        // si el type es 3, se ha seleccionado una ciudad, por lo tanto se habilita la opcion de agregar direccion
        case 3:
            if(inputContactCity.value != 0){
                inputContactAddress.disabled = false;
            }
            break;
    }
}

//-----> Funcion para abrir el formulario de carga de nuevo contacto
async function showContactForm( contact ){    
    let contactTitle = document.getElementById("add-contact-modal-title");
    backgroundModalsManage();
    
    // cargo las compañias
    let companies = await getAllCompaniesService();
    if(companies){        
        companies.sort( sortArray );        
        let defaultOption = document.createElement("option");
        defaultOption.value = 0;
        defaultOption.textContent = "Seleccione una compañía";
        defaultOption.hidden = true;
        defaultOption.selected = true;
        inputContactCompany.appendChild(defaultOption);
        companies.forEach( company => {
            let option = document.createElement("option");
            option.value = company.id;
            option.textContent = company.name;
            inputContactCompany.appendChild(option);
        });
        inputContactCompany.disabled = false;
    }
    else{
        console.log("No hay compañías disponibles")
        inputContactCompany.disabled = true;
    }
    
    // cargo las regiones en el select
    let regions = await getAllRegionsService();
    if(regions){        
        regions.sort( sortArray );        
        let defaultOption = document.createElement("option");
        defaultOption.value = 0;
        defaultOption.textContent = "Seleccione una región";
        defaultOption.hidden = true;
        defaultOption.selected = true;
        inputContactRegion.appendChild(defaultOption);
        regions.forEach( region => {
            let option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.name;
            inputContactRegion.appendChild(option);
        });
    }
    else{
        console.log("No hay regiones disponibles")
        inputContactRegion.disabled = true;
    }
    
    // si no hay un usuario, la accion es un alta de contacto
    if(!contact){
        document.getElementById("contact-form").reset();
        contactTitle.textContent = "AGREGAR CONTACTO";
        btnCreateContact.classList.remove("disabled");
        btnUpdateContact.classList.add("disabled");
    } else{
        // sino la accion es una modificacion del usuario
        inputContactName.value = contact.firstname;
        inputContactLastname.value = contact.lastname;
        inputContactPosition.value = contact.position;
        inputContactMail.value = contact.mail;
        inputContactAddress.value = contact.address;
        inputContactInterest.value = contact.interest;
        inputContactCompany.value = contact.companyId;
        inputContactRegion.value = contact.regionId;
        // procedo a hacer la carga de la region, pais y ciudad  
        await getUbication(1);    
        inputContactCountry.value = contact.countryId;
        await getUbication(2);  
        inputContactCity.value = contact.cityId;         
        await getUbication(3);
        // hago la carga de los canales de contacto
        for(let i = 0; i < contact.contactChannels.length; i++){
            let inputCheck = document.getElementById(`channel-check-${i+1}`);
            let inputCChannel = document.getElementById(`add-contact-channel-${i+1}`);
            let inputCAccount = document.getElementById(`add-contact-account-${i+1}`);
            let inputCPreference = document.getElementById(`add-contact-preference-${i+1}`);
            inputCheck.checked = true;
            const e = new Event("change");
            inputCheck.dispatchEvent(e);
            inputCChannel.value = contact.contactChannels[i].contact_channel_id;
            setContactChannel(i+1);
            inputCAccount.value = contact.contactChannels[i].account;
            inputCPreference.value = contact.contactChannels[i].preference_id;
        }
        contactToUpdate = contact;

        btnCreateContact.classList.add("disabled");
        btnUpdateContact.classList.remove("disabled");
    }
    let addContactModal = document.getElementById("add-contact-modal");
    addContactModal.classList.remove("disabled");
}


//-----> Funcion para habilitar los campos de cuenta y preferencia una vez haya seleccionado el canal de contacto
function setContactChannel(id){
    console.log("seleccionado el channel")
    switch(id){
        case 1:
            if(inputContactChannel1.value != 0){                
                inputContactAccount1.disabled = false;
                inputContactPreference1.disabled = false;
            }
            break;
        case 2:
            if(inputContactChannel2.value != 0){                
                inputContactAccount2.disabled = false;
                inputContactPreference2.disabled = false;
            }
            break;
        case 3:
            if(inputContactChannel3.value != 0){                
                inputContactAccount3.disabled = false;
                inputContactPreference3.disabled = false;
            }
            break;
        case 4:
            if(inputContactChannel4.value != 0){                
                inputContactAccount4.disabled = false;
                inputContactPreference4.disabled = false;
            }
            break;
        case 5:
            if(inputContactChannel5.value != 0){                
                inputContactAccount5.disabled = false;
                inputContactPreference5.disabled = false;
            }
            break;
        default:
            break;
    }
}


//-----> Funcion para efectuar un ordenamiento en los select
function sortArray(a, b){
    if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
}

//-----> Funcion para cerrar el formulario de nuevo usuario
function closeContactForm(){    
    backgroundModalsManage();
    document.getElementById("contact-form").reset();
    let addContactModal = document.getElementById("add-contact-modal");    
    addContactModal.classList.add("disabled");
    clearSelectChild(inputContactCompany);
    clearSelectChild(inputContactRegion);
    clearSelectChild(inputContactCountry);
    clearSelectChild(inputContactCity);
    inputContactCountry.disabled = true;
    inputContactCity.disabled = true;
    inputContactChannel1.disabled = true
    inputContactAccount1.disabled = true;
    inputContactPreference1.disabled = true;
    inputContactChannel2.disabled = true
    inputContactAccount2.disabled = true;
    inputContactPreference2.disabled = true;
    inputContactChannel3.disabled = true
    inputContactAccount3.disabled = true;
    inputContactPreference3.disabled = true;
    inputContactChannel4.disabled = true
    inputContactAccount4.disabled = true;
    inputContactPreference4.disabled = true;
    inputContactChannel5.disabled = true
    inputContactAccount5.disabled = true;
    inputContactPreference5.disabled = true;
    
}

//-----> Funcion para borrar el contenido de los select para refrescar el mismo
function clearSelectChild(object){
    while(object.firstChild){
        object.removeChild(object.firstChild);
    }
}


//-----> Funcion para efectuar validacion del formulario y llamar al servicio para crear un nuevo usuario
async function addContact(){    

    if(!validateContactForm()){        
        return;
    }        
   
    let contactChannels = getContactChannels();    

    let addContactRequest = {
        firstname: inputContactName.value,
        lastname: inputContactLastname.value,
        position: inputContactPosition.value,
        mail: inputContactMail.value,
        address: inputContactAddress.value,
        interest: Number(inputContactInterest.value),
        companyId: Number(inputContactCompany.value),
        cityId: Number(inputContactCity.value),
        contactChannels: contactChannels
    }
    console.log("addContactRequest", addContactRequest)
    operationSpinner.classList.remove("disabled");
    await addContactService(addContactRequest);
    operationSpinner.classList.add("disabled");
    
    closeContactForm();
}


//-----> Funcion para efectuar la validacion de los canales de contactos, que tengan los campos completos
function validateContactForm(){
    
    if(!inputContactName.value || !inputContactLastname.value || !inputContactPosition.value || !inputContactMail.value || !REGEX_MAIL.test(inputContactMail.value) || inputContactCompany.value == 0
        || inputContactRegion.value == 0 || inputContactCountry.value == 0 || inputContactCity.value == 0 || !inputContactAddress.value
    ){
        console.log("Complete los campos obligatorios")
        if(!inputContactName.value){
            inputContactName.classList.remove("border-default");
            inputContactName.classList.add("border-no-content");
        }
        if(!inputContactLastname.value){
            inputContactLastname.classList.remove("border-default");
            inputContactLastname.classList.add("border-no-content");
        }
        if(!inputContactPosition.value){
            inputContactPosition.classList.remove("border-default");
            inputContactPosition.classList.add("border-no-content");
        }
        if(!inputContactMail.value || !REGEX_MAIL.test(inputContactMail.value)){
            inputContactMail.classList.remove("border-default");
            inputContactMail.classList.add("border-no-content");
        }
        if(inputContactCompany.value == 0){
            inputContactCompany.classList.remove("border-default");
            inputContactCompany.classList.add("border-no-content");
        }
        if(inputContactRegion.value == 0){
            inputContactRegion.classList.remove("border-default");
            inputContactRegion.classList.add("border-no-content");
        }
        if(inputContactCountry.value == 0){
            inputContactCountry.classList.remove("border-default");
            inputContactCountry.classList.add("border-no-content");
        }
        if(inputContactCity.value == 0){
            inputContactCity.classList.remove("border-default");
            inputContactCity.classList.add("border-no-content");
        }
        if(!inputContactAddress.value){
            inputContactAddress.classList.remove("border-default");
            inputContactAddress.classList.add("border-no-content");
        }

        return false;
    } 
    // hago la verificacion sobre los canales de contactos
    for(let i = 1; i <= 5; i++ ){        
        let inputCheck = document.getElementById(`channel-check-${i}`);
        if(inputCheck.checked === true){
            console.log("Hay un check verificado")
            let inputCChannel = document.getElementById(`add-contact-channel-${i}`);
            let inputCAccount = document.getElementById(`add-contact-account-${i}`);
            let inputCPreference = document.getElementById(`add-contact-preference-${i}`);
            
            if(inputCChannel.value == 0 || !inputCAccount.value || inputCPreference.value == 0){
                if(inputCChannel.value == 0){
                    inputCChannel.classList.remove("border-default");
                    inputCChannel.classList.add("border-no-content");
                }
                if(!inputCAccount.value){
                    inputCAccount.classList.remove("border-default");
                    inputCAccount.classList.add("border-no-content");
                }
                if(inputCPreference.value == 0){
                    inputCPreference.classList.remove("border-default");
                    inputCPreference.classList.add("border-no-content");
                }

                return false;
            }
        }
    }

    return true;
}


//-----> Funcion para chequear los canales de contactos que tengan el check, de esta forma seran agregados al request
function getContactChannels(){
    let contactChannelsArrayn = [];    
    
    for(let i = 1; i <= 5; i++ ){        
        let inputCheck = document.getElementById(`channel-check-${i}`);
        if(inputCheck.checked === true){
            let inputCChannel = document.getElementById(`add-contact-channel-${i}`);
            let inputCAccount = document.getElementById(`add-contact-account-${i}`);
            let inputCPreference = document.getElementById(`add-contact-preference-${i}`);
            let contChannel = {
                contactChannelId: Number(inputCChannel.value),
                preferenceId: Number(inputCPreference.value),
                account: inputCAccount.value
            }
            contactChannelsArrayn.push(contChannel)
        }
    }
    
    return contactChannelsArrayn;
}



//------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------->  MODIFICAR CONTACTO
let btnUpdateContact = document.getElementById("update-contact");
btnUpdateContact.addEventListener("click", updateContact );

let contactToUpdate;

//-----> Funcion para efectuar la actualizacion del contacto
async function updateContact(){    
    if(!validateContactForm()){        
        return;
    }        
   
    let contactChannels = getContactChannels();    

    let updateContactRequest = {
        id: contactToUpdate.id,
        firstname: inputContactName.value,
        lastname: inputContactLastname.value,
        position: inputContactPosition.value,
        mail: inputContactMail.value,
        address: inputContactAddress.value,
        interest: Number(inputContactInterest.value),
        companyId: Number(inputContactCompany.value),
        cityId: Number(inputContactCity.value),
        contactChannels: contactChannels
    }
    console.log("updateContactRequest", updateContactRequest)
    operationSpinner.classList.remove("disabled");
    await updateContactService(updateContactRequest);
    operationSpinner.classList.add("disabled");
    
    closeContactForm();
}


//------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------->  ORDENAR CONTACTOS

let order = 1;

let liContact = document.getElementById("li-contact");
let liCountry = document.getElementById("li-country");
let liCompany = document.getElementById("li-company");
let liPosition = document.getElementById("li-position");
let liChannel = document.getElementById("li-channel");
let liInterest = document.getElementById("li-interest");
liContact.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('firstname') :  sortContactsDesc('firstname') });
liCountry.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('countryName') :  sortContactsDesc('countryName') });
liCompany.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('companyName') :  sortContactsDesc('companyName') });
liPosition.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('position') :  sortContactsDesc('position') });
liChannel.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('contactChannels') :  sortContactsDesc('contactChannels') });
liInterest.addEventListener("click", ()=>{ order === 1 ? sortContactsAsc('interest') :  sortContactsDesc('interest') });


//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de forma ascendente
function sortContactsAsc(column){
    contactsArray.sort( function(a, b){
        switch (column) {
            case 'firstname':
                if(a.firstname > b.firstname)
                    return 1;
                if(a.firstname < b.firstname)
                    return -1;
                return 0;

            case 'countryName':
                if(a.countryName > b.countryName)
                    return 1;
                if(a.countryName < b.countryName)
                    return -1;
                return 0;

            case 'companyName':
                if(a.companyName > b.companyName)
                    return 1;
                if(a.companyName < b.companyName)
                    return -1;
                return 0;

            case 'position':
                if(a.position > b.position)
                    return 1;
                if(a.position < b.position)
                    return -1;
                return 0;

            case 'contactChannels':
                if(a.contactChannels.length > b.contactChannels.length)
                    return 1;
                if(a.contactChannels.length < b.contactChannels.length)
                    return -1;
                return 0;

            case 'interest':
                if(a.interest > b.interest)
                    return 1;
                if(a.interest < b.interest)
                    return -1;
                return 0;

            default:
                break;
        }
    })
    loadContacts(contactsArray);
    order = 2;
}

//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de forma descendente
function sortContactsDesc(column){
    contactsArray.sort( function(a, b){
        switch (column) {
            case 'firstname':
                if(a.firstname > b.firstname)
                    return -1;
                if(a.firstname < b.firstname)
                    return 1;
                return 0;

            case 'countryName':
                if(a.countryName > b.countryName)
                    return -1;
                if(a.countryName < b.countryName)
                    return 1;
                return 0;

            case 'companyName':
                if(a.companyName > b.companyName)
                    return -1;
                if(a.companyName < b.companyName)
                    return 1;
                return 0;

            case 'position':
                if(a.position > b.position)
                    return -1;
                if(a.position < b.position)
                    return 1;
                return 0;

            case 'contactChannels':
                if(a.contactChannels.length > b.contactChannels.length)
                    return -1;
                if(a.contactChannels.length < b.contactChannels.length)
                    return 1;
                return 0;

            case 'interest':
                if(a.interest > b.interest)
                    return -1;
                if(a.interest < b.interest)
                    return 1;
                return 0;

            default:
                break;
        }
    })
    loadContacts(contactsArray);
    order = 1;
}


//------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------->  EXPORTAR CONTACTOS

let btnExportContacts = document.getElementById("export-contacts");
btnExportContacts.addEventListener("click", showExportOptions );

let onlySelected = document.getElementById("only-selected");
let listed = document.getElementById("listed");
onlySelected.addEventListener("click", ()=>{ generateExcel(1) });
listed.addEventListener("click", ()=>{ generateExcel(2) });



//-----> Funcion para mostrar los botones de exportacion por categoria
function showExportOptions(){
    selectedContactArray.length > 0 ? onlySelected.disabled = false : onlySelected.disabled = true;        
    searchContactResult.length > 0 ? listed.disabled = false : listed.disabled = true;        
    
    let exportation = document.getElementById("exportation");
    exportation.classList.toggle("disabled");
    btnExportContacts.classList.toggle("btn-active");
}



//-----> Funcion para generar el excel segun la opcion de exportacion seleccionada
function generateExcel(option){
    // creo un nuevo archivo de trabajo
    let wb = XLSX.utils.book_new();
    // defino las propiedades del documento
    wb.Props = {
        Title: "Data Warehouse - Contactos",
        Subject: "Data Warehouse",
        Author: "Ruben Gonzalez",
        CreatedDate: new Date()
    };
    // defino el nombre de una nueva hoja de datos
    wb.SheetNames.push("Contactos");
    // defino el contenido de la hoja de datos
    // let ws_data = [['hello' , 'world']];
    let exportArray = null;
    if(option === 1){
        exportArray = selectedContactArray;
    } else{
        exportArray = searchContactResult;
    }
    let customExportArray = [];
    console.log("EXPORT ARRAY", exportArray)
    for(let i = 0; i < exportArray.length; i++){
        let contactChannels = [];
        let accounts = [];
        let preferences = [];

        // segun la cantidad de canales de contactos que posea la persona, se van completando los arrays
        for(let j = 0; j < exportArray[i].contactChannels.length; j++){
            contactChannels[j] = exportArray[i].contactChannels[j].contact_channel_name;
            accounts[j] = exportArray[i].contactChannels[j].account;
            preferences[j] = exportArray[i].contactChannels[j].preference_name;
        }

        //genero un objeto nuevo para cada contacto, segun la informacion que me interesa exportar al excel
        let object = {
            contacto: exportArray[i].firstname + " " + exportArray[i].lastname,
            mail: exportArray[i].mail,
            region: exportArray[i].regionName,
            pais: exportArray[i].countryName,
            compañia: exportArray[i].companyName,
            cargo: exportArray[i].position,
            interes: exportArray[i].interest,
            canal_de_contacto1: contactChannels[0],
            cuenta1: accounts[0],
            preferencia1: preferences[0],       
            canal_de_contacto2: contactChannels[1],
            cuenta2: accounts[1],
            preferencia2: preferences[1],       
            canal_de_contacto3: contactChannels[2],
            cuenta3: accounts[2],
            preferencia3: preferences[2],       
            canal_de_contacto4: contactChannels[3],
            cuenta4: accounts[3],
            preferencia4: preferences[3],       
            canal_de_contacto5: contactChannels[4],
            cuenta5: accounts[4],
            preferencia5: preferences[4],       
        }
        customExportArray.push(object);
    }
    // let ws_data = customExportArray;

    // convierto el array en formato de hoja de datos definida
    let ws = XLSX.utils.json_to_sheet(customExportArray);
    // inserto el contenido en la hoja de datos creada
    wb.Sheets["Contactos"] = ws;

    // necesitamos exportar la hoja de trabajo a un excel binario
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // convertiremos la data binario a octet stream que es a data real que usa excel
    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'datawarehouse.xlsx');

    showExportOptions();
}
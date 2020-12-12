//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------->  OBTENER LISTA DE COMPAÑÍAS

let btnRefreshCompanies = document.getElementById("refresh-companies");
btnRefreshCompanies.addEventListener("click", getAllCompanies );

let companiesArray;

let btnCompaniesPrevious = document.getElementById("companies-previous");
let btnCompaniesNext = document.getElementById("companies-next");
btnCompaniesPrevious.addEventListener("click", companiesPreviousPage );
btnCompaniesNext.addEventListener("click", companiesNextPage );



//-----> Funcion para obtener el listado de todos los usuarios activos
async function getAllCompanies(){
    operationSpinner.classList.remove("disabled");
    companiesArray = await getAllCompaniesService();
    operationSpinner.classList.add("disabled");    
    console.log("companias ", companiesArray)

    if(companiesArray){        
        loadCompanies(companiesArray);
    }
}


const companiesPageSize = 10;
let companiesPageNumber = 1;
let companiesPageCont = 0;


//-----> Funcion para cargar la tabla con las compañìas obtenidas
function loadCompanies(registers){
    clearCompaniesTableBody();
   
    companiesPageCont = Math.ceil(registers.length / companiesPageSize);
    let companiesPage = companiesPaginate(registers, companiesPageSize, companiesPageNumber);

    companiesPage.forEach(element => {
        // creo cada uno de los registros por usuario existente
        let divRegister = document.createElement("div");
        divRegister.classList.add("table-register");
        divRegister.classList.add("unselected-register");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("companies-check");
        divRegister.appendChild(checkbox);

        let divProperties = document.createElement("div");
        divProperties.classList.add("table-properties");
        divProperties.classList.add("six-elements");
        let spanName = document.createElement("span");
        let spanAddress = document.createElement("span");
        let spanCity = document.createElement("span");
        let spanCountry = document.createElement("span");
        let spanMail = document.createElement("span");
        let spanPhone = document.createElement("span");

        spanName.textContent = element.name;
        spanAddress.textContent = element.address;
        spanCity.textContent = element.city_name;
        spanCountry.textContent = element.country_name;
        spanMail.textContent = element.mail;
        spanPhone.textContent = element.phone;
        divProperties.appendChild(spanName);
        divProperties.appendChild(spanAddress);
        divProperties.appendChild(spanCity);
        divProperties.appendChild(spanCountry);
        divProperties.appendChild(spanMail);
        divProperties.appendChild(spanPhone);
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
        btnTrash.addEventListener("click", function(){ showDeleteCompanyConfirmation(element.id); });
        btnEdit.addEventListener("click", function(){ showCompanyForm(element) });
        checkbox.addEventListener("change", function(event){ selectedCompanyRegister( event, divRegister, element) });

        let tableBody = document.getElementById("companies-table-body");
        tableBody.appendChild(divRegister);
    });

    // manejo los botones de paginas
    if(companiesPageNumber > 1){
        btnCompaniesPrevious.disabled = false;
        btnCompaniesPrevious.classList.add("btn-available");
        btnCompaniesPrevious.classList.remove("btn-unavailable");
    } else{
        btnCompaniesPrevious.disabled = true;
        btnCompaniesPrevious.classList.add("btn-unavailable");
        btnCompaniesPrevious.classList.remove("btn-available");
    }
    if(companiesPageNumber < companiesPageCont){
        btnCompaniesNext.disabled = false;
        btnCompaniesNext.classList.add("btn-available");
        btnCompaniesNext.classList.remove("btn-unavailable");
    } else {
        btnCompaniesNext.disabled = true;
        btnCompaniesNext.classList.add("btn-unavailable");
        btnCompaniesNext.classList.remove("btn-available");
    }
}

//-----> Funcion para determinar los registros que entran en la primer pagina
function companiesPaginate( array, page_size, page_number ) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

//-----> Funcion para avanzar a la siguiente pagina
function companiesNextPage(){
    companiesPageNumber ++;
    loadCompanies(companiesArray);
}

//-----> Funcion para volver a la pagina anterior
function companiesPreviousPage(){
    companiesPageNumber --;
    loadCompanies(companiesArray);
}


//-----> Funcion para eliminar los hijos del contenedor de registros de compañias
function clearCompaniesTableBody(){
    companiesMultiCheck.checked = false;    
    selectedCompaniesArray = [];
    let tableBody = document.getElementById("companies-table-body");
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
}




//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------->  BORRAR UNA COMPAÑÍA
let companyNo = document.getElementById("company-no");
companyNo.addEventListener("click", closeDeleteCompanyConfirmation );
let companyYes = document.getElementById("company-yes");
companyYes.addEventListener("click", deleteCompany );

let companyToDelete = null;

//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showDeleteCompanyConfirmation(company_id){    
    backgroundModalsManage();
    companyMultiYes.classList.add("disabled");
    companyYes.classList.remove("disabled");
    let confirmation = document.getElementById("confirmation-company");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-company");
    question.textContent = "¿Estas seguro que deseas borrar la compañía?";
    companyToDelete = company_id;    
}


//-----> Funcion para efectuar el cierre del modal de confirmacion de eliminacion
function closeDeleteCompanyConfirmation(){
    backgroundModalsManage()
    let confirmation = document.getElementById("confirmation-company");
    confirmation.classList.add("disabled");
}


//-----> Funcion para llamar al servicio de eliminacion de compañia
async function deleteCompany(){
    closeDeleteCompanyConfirmation();
    operationSpinner.classList.remove("disabled");
    let result = await deleteCompanyService(companyToDelete);
    operationSpinner.classList.add("disabled");
   
    if(result){
        let message = "La compañía fue borrada exitosamente";
        toggleNotificacionModal(message);
    }
    
}


//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------->  BORRAR MULTIPLES COMPAÑÍAS
let btnMultiDeleteCompany = document.getElementById("multidelete-company");
btnMultiDeleteCompany.addEventListener("click", showMultipleDeleteCompanyConfirmation );

let companyMultiYes = document.getElementById("company-multi-yes");
companyMultiYes.addEventListener("click", multipleDeleteCompany );

//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showMultipleDeleteCompanyConfirmation(){    
    backgroundModalsManage();
    companyMultiYes.classList.remove("disabled");
    companyYes.classList.add("disabled");
    let confirmation = document.getElementById("confirmation-company");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-company");
    question.textContent = `¿Estas seguro que deseas borrar ${selectedCompaniesArray.length} compañías?`;     
}


//-----> Funcion para efectuar el borrado de multiples registros
async function multipleDeleteCompany(){
    closeDeleteCompanyConfirmation();
    operationSpinner.classList.remove("disabled");
  
    if(selectedCompaniesArray && selectedCompaniesArray.length > 0){
        try{
            for(let i = 0; i < selectedCompaniesArray.length; i++){          
                await deleteCompanyService(selectedCompaniesArray[i].id);                           
            }

            operationSpinner.classList.add("disabled");
            selectedCompaniesArray = [];

            let message = "Se han borrado las compañías seleccionadas";
            toggleNotificacionModal(message);
        } catch{
            let message = "No se han podido borrar las compañías seleccionadas";
            toggleNotificacionModal(message);
        }
    }
    let multidelete = document.getElementById("multidelete-company");
    multidelete.classList.add("disabled");
}



//------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------->  AGREGAR COMPAÑÍA
let btnAddCompany = document.getElementById("add-company");
btnAddCompany.addEventListener("click", function(){ showCompanyForm(null) });

let btnCancelAddCompany = document.getElementById("cancel-company");
btnCancelAddCompany.addEventListener("click", closeCompanyForm );

let btnCreateCompany = document.getElementById("create-company");
btnCreateCompany.addEventListener("click", AddCompany);

/* componentes del formulario de alta */
let inputCompanyName = document.getElementById("add-company-name");
let inputCompanyAddress = document.getElementById("add-company-address");
let inputCompanyPhone = document.getElementById("add-company-phone");
let inputCompanyMail = document.getElementById("add-company-mail");
let selectCompanyCity = document.getElementById("add-company-city");
inputCompanyName.addEventListener("focus", () => { inputCompanyName.classList.add("border-default"); inputCompanyName.classList.remove("border-no-content");})
inputCompanyAddress.addEventListener("focus", () => { inputCompanyAddress.classList.add("border-default"); inputCompanyAddress.classList.remove("border-no-content");})
inputCompanyPhone.addEventListener("focus", () => { inputCompanyPhone.classList.add("border-default"); inputCompanyPhone.classList.remove("border-no-content");})
inputCompanyMail.addEventListener("focus", () => { inputCompanyMail.classList.add("border-default"); inputCompanyMail.classList.remove("border-no-content");})



//-----> Funcion para abrir el formulario de carga de nuevo usuario
async function showCompanyForm( company ){
    let companyTitle = document.getElementById("add-company-modal-title");
    backgroundModalsManage();

    // cargo las ciudades en el select
    let cities = await getAllCitiesService();
    if(cities){
        cities.sort( sortArray );
        cities.forEach( city => {
            let option = document.createElement("option");
            option.value = city.id;
            option.textContent = city.name;
            selectCompanyCity.appendChild(option);
        })
    } else {
        console.log("No hay compñias para cargar");
    }
    
    
    // si no hay un usuario, la accion es un alta de usuario
    if(!company){
        document.getElementById("company-form").reset();
        companyTitle.textContent = "AGREGAR COMPAÑÍA";
        btnCreateCompany.classList.remove("disabled");
        btnUpdateCompany.classList.add("disabled");
        
    } else{
        // sino la accion es una modificacion del usuario
        inputCompanyName.value = company.name;
        companyTitle.textContent = "MODIFICAR COMPAÑÍA";
        inputCompanyAddress.value = company.address;
        inputCompanyPhone.value = company.phone;
        inputCompanyMail.value = company.mail;
        selectCompanyCity.value = company.city_id;
        btnCreateCompany.classList.add("disabled");
        btnUpdateCompany.classList.remove("disabled");

        companyToUpdate = company;
    }
    let addCompanyModal = document.getElementById("add-company-modal");
    addCompanyModal.classList.remove("disabled");
}

selectCompanyCity.addEventListener('mousedown', function () {
    this.size=5;
});
selectCompanyCity.addEventListener('change', function () {
    this.blur();
});
selectCompanyCity.addEventListener('blur', function () {
    this.size=0;
});


//-----> Funcion para cerrar el formulario de nuevo usuario
function closeCompanyForm(){
    backgroundModalsManage();
    document.getElementById("company-form").reset();
    let addCompanyModal = document.getElementById("add-company-modal");
    addCompanyModal.classList.add("disabled");
    // en caso que se cierre el modal si ningun cambio, vuelve el formato de los inputs a la normalidad
    inputCompanyName.classList.add("border-default"); 
    inputCompanyName.classList.remove("border-no-content");
    inputCompanyAddress.classList.add("border-default"); 
    inputCompanyAddress.classList.remove("border-no-content"); 
    inputCompanyPhone.classList.add("border-default"); 
    inputCompanyPhone.classList.remove("border-no-content"); 
    inputCompanyMail.classList.add("border-default"); 
    inputCompanyMail.classList.remove("border-no-content");
}


//-----> Funcion para efectuar validacion del formulario y llamar al servicio para crear un nuevo usuario
async function AddCompany(){    

    if(!validateCompanyForm()){        
        return;
    }    

    let addCompanyRequest = {
        name: inputCompanyName.value,
        address: inputCompanyAddress.value,
        phone: inputCompanyPhone.value,
        mail: inputCompanyMail.value,
        cityId: Number(selectCompanyCity.value)
    }
    console.log("addCompanyRequest ", addCompanyRequest)
    operationSpinner.classList.remove("disabled");
    await addCompanyService(addCompanyRequest);
    operationSpinner.classList.add("disabled");
    
    closeCompanyForm();
}


//-----> Funcion para hacer la validacion del formulario de compañia
function validateCompanyForm(){
    if(!inputCompanyName.value || !inputCompanyAddress.value || !inputCompanyPhone.value || !inputCompanyMail.value || !REGEX_MAIL.test(inputCompanyMail.value)){
        console.log("Complete los campos obligatorios")
        if(!inputCompanyName.value){
            inputCompanyName.classList.remove("border-default");
            inputCompanyName.classList.add("border-no-content");
        }
        if(!inputCompanyAddress.value){
            inputCompanyAddress.classList.remove("border-default");
            inputCompanyAddress.classList.add("border-no-content");
        }
        if(!inputCompanyPhone.value){
            inputCompanyPhone.classList.remove("border-default");
            inputCompanyPhone.classList.add("border-no-content");
        }
        if(!inputCompanyMail.value || !REGEX_MAIL.test(inputCompanyMail.value)){
            console.log("formato de mail incorrecto o mail inexistente")
            inputCompanyMail.classList.remove("border-default");
            inputCompanyMail.classList.add("border-no-content");
        }
        return false;
    }

    return true;
}

//------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------->  MODIFICAR UNA COMPAÑÍA
let btnUpdateCompany= document.getElementById("update-company");
btnUpdateCompany.addEventListener("click", updateCompany );

let companyToUpdate;

//-----> Funcion para efectuar la actualizacion de la compañia
async function updateCompany(){
    if(!validateCompanyForm()){        
        console.log("retorno falso")
        return;
    }    

    let updateCompanyRequest = {
        id: companyToUpdate.id,
        name: inputCompanyName.value,
        address: inputCompanyAddress.value,
        phone: inputCompanyPhone.value,
        mail: inputCompanyMail.value,
        cityId: Number(selectCompanyCity.value),
    }
    console.log("updateCompanyRequest ", updateCompanyRequest)
    operationSpinner.classList.remove("disabled");
    await updateCompanyService(updateCompanyRequest);
    operationSpinner.classList.add("disabled");
    
    closeCompanyForm();    
}



//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------> SELECCION DE REGISTRO
let selectedCompaniesArray = [];

//-----> Funcion para pintar el registro seleccionado
function selectedCompanyRegister( event, selected, company ){
    let multidelete = document.getElementById("multidelete-company");
    if(event.target.checked){
        selected.classList.add("selected-register");
        selected.classList.remove("unselected-register");
        selectedCompaniesArray.push(company);
        multidelete.classList.remove("disabled");
    } else{
        selected.classList.remove("selected-register");
        selected.classList.add("unselected-register");
        selectedCompaniesArray.splice( selectedCompaniesArray.indexOf(company), 1)
        if(selectedCompaniesArray.length === 0){
            multidelete.classList.add("disabled");
        }
    }
    console.log("Compañías seleccionadas", selectedCompaniesArray)
}



let companiesMultiCheck = document.getElementById("companies-multicheck");
companiesMultiCheck.addEventListener("change", function(event){ toggleCompaniesMultiSelection(event) })

//-----> Funcion para marcar o desmarcar registros cuando se selecciona el checkbox general
function toggleCompaniesMultiSelection(ev){
    let checkboxes = document.getElementsByClassName("companies-check");
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
//---------------------------------------------------------------------------------->  ORDENAR COMPAÑÍAS


let liCompanyName = document.getElementById("licompany-name");
let liCompanyAddress = document.getElementById("licompany-address");
let liCompanyCity = document.getElementById("licompany-city");
let liCompanyCountry = document.getElementById("licompany-country");
let liCompanyMail = document.getElementById("licompany-mail");
let liCompanyPhone = document.getElementById("licompany-phone");
liCompanyName.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('name') :  sortCompanyDesc('name') });
liCompanyAddress.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('address') :  sortCompanyDesc('address') });
liCompanyCity.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('city_name') :  sortCompanyDesc('city_name') });
liCompanyCountry.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('country_name') :  sortCompanyDesc('country_name') });
liCompanyMail.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('mail') :  sortCompanyDesc('mail') });
liCompanyPhone.addEventListener("click", ()=>{ order === 1 ? sortCompanyAsc('phone') :  sortCompanyDesc('phone') });


//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de manera ascendente
function sortCompanyAsc(column){
    companiesArray.sort( function(a, b){
        switch (column) {
            case 'name':
                if(a.name > b.name)
                    return 1;
                if(a.name < b.name)
                    return -1;
                return 0;

            case 'address':
                if(a.address > b.address)
                    return 1;
                if(a.address < b.address)
                    return -1;
                return 0;

            case 'city_name':
                if(a.city_name > b.city_name)
                    return 1;
                if(a.city_name < b.city_name)
                    return -1;
                return 0;

            case 'country_name':
                if(a.country_name > b.country_name)
                    return 1;
                if(a.country_name < b.country_name)
                    return -1;
                return 0;

            case 'mail':
                if(a.mail > b.mail)
                    return 1;
                if(a.mail < b.mail)
                    return -1;
                return 0;

            case 'phone':
                if(a.phone > b.phone)
                    return 1;
                if(a.phone < b.phone)
                    return -1;
                return 0;

            default:
                break;
        }
    })
    loadCompanies(companiesArray);
    order = 2;
}

//-----> Funcion para efectuar el ordenamiento de la tabla segun la columna seleccionada de manera descendente
function sortCompanyDesc(column){
    companiesArray.sort( function(a, b){
        switch (column) {
            case 'name':
                if(a.name > b.name)
                    return -1;
                if(a.name < b.name)
                    return 1;
                return 0;

            case 'address':
                if(a.address > b.address)
                    return -1;
                if(a.address < b.address)
                    return 1;
                return 0;

            case 'city_name':
                if(a.city_name > b.city_name)
                    return -1;
                if(a.city_name < b.city_name)
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

            case 'phone':
                if(a.phone > b.phone)
                    return -1;
                if(a.phone < b.phone)
                    return 1;
                return 0;

            default:
                break;
        }
    })
    loadCompanies(companiesArray);
    order = 1;
}
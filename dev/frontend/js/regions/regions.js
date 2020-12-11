//------------------------------------------------------------------------------------------------------
//------------------------------------------------------>  OBTENER LISTA DE REGIONES / PAISES / CIUDADES
let regionsArray = [];
let countriesArray = [];
let citiesArray = [];

var SelectedNode = null;
var SelectedNodeType = null;

let btnAddNode = document.getElementById("add-node");
btnAddNode.addEventListener("click",function(){ showUbicationForm( null ) });

let btnDeleteNode = document.getElementById("delete-node");
btnDeleteNode.addEventListener("click", showDeleteNodeConfirmation );

let btnEditNode = document.getElementById("edit-node");
btnEditNode.addEventListener("click", function(){ showUbicationForm( SelectedNode ) });

let refreshTree = document.getElementById("refresh-tree");
refreshTree.addEventListener("click", getAllUbications);

//-----> Funcion para obtener el listado de todas las ubicaciones
async function getAllUbications(){
    
    operationSpinner.classList.remove("disabled");
    regionsArray = await getAllRegionsService();    
    countriesArray = await getAllCountriesService();
    citiesArray = await getAllCitiesService();
    operationSpinner.classList.add("disabled");

    btnAddNode.classList.add("disabled");
    btnDeleteNode.classList.add("disabled");
    btnEditNode.classList.add("disabled");

    if(regionsArray){
        loadUbications();
    }
}


//-----> Funcion para armar y graficar la estructura del arbol de ubicaciones
function loadUbications(){
    clearNodesList();
    let divTree = document.getElementById("jstree");
    let ul = document.createElement("ul");
    divTree.appendChild(ul);
    
    let root = document.createElement("li");
    root.id = "root";
    root.textContent = "Regiones";
    ul.appendChild(root);

    let regionsUl = document.createElement("ul");  
    regionsUl.id = "regions-ul";
    // por cada una de las regiones, procedo a crear su pais y ciudad
    regionsArray.forEach( region => {
        let createCountryUl = false;        
        let countryUl = null;        
        
        let regionLi = document.createElement("li");        
        regionLi.textContent = region.name;
        regionLi.id = "type1_" + region.name;
        

        // analizo cada pais
        countriesArray.forEach( country => {
            let createCityUl = false;
            let cityUl = null;
            // si un pais tiene el mismo codigo de la region, creare los elementos para agregarlo como hijo de la region
            if(region.id === country.region_id){
                if(createCountryUl === false){
                    countryUl = document.createElement("ul");
                    createCountryUl = true;
                }
                let countryLi = document.createElement("li");
                countryLi.textContent = country.name;
                countryLi.id = "type2_" + country.name;
                
                // analizo cada ciudad
                citiesArray.forEach( city => {
                    // si una ciudad tiene el mismo codigo que el pais, creare los elementos para agregarla como hijo del pais
                    if(country.id === city.country_id){
                        if(createCityUl === false){
                            cityUl = document.createElement("ul");
                            createCityUl = true;
                        }
                        let cityLi = document.createElement("li");
                        cityLi.textContent = city.name;
                        cityLi.id = "type3_" + city.name;
                        cityUl.appendChild(cityLi);                        
                    }
                });
                if(cityUl)
                    countryLi.appendChild(cityUl);  

                countryUl.appendChild(countryLi);                
            }
        });
        if(countryUl){
            regionLi.appendChild(countryUl);
        }
        // agrego cada region al UL general de regiones
        regionsUl.appendChild(regionLi);

    })

    root.appendChild(regionsUl);

    // accion en JQuery que me permite generar una instancia del arbol y refrescarlo con la data nueva
    $('#jstree').jstree();
    $('#jstree').jstree(true).refresh();
    $('#jstree').jstree(true).redraw(true);
    // funcionalidad para dejar seleccionado el nodo root y mostrar las regiones ni bien se carga.
    $("#jstree").jstree("open_node", $('#root'));

    jstreeFunctions();    
}


//-----> Funcion para establecer el comportamiento del arbol de ubicaciones segun la accion
function jstreeFunctions(){
    $('#jstree').on("changed.jstree", function (e, data) {
        let btnAdd = document.getElementById("add-node");
        let btnEdit = document.getElementById("edit-node");
        let btnDelete = document.getElementById("delete-node");
        if(data.selected.length > 0){
            console.log(data.selected);
            let node = data.selected[0].split("_");
            console.log(node);

            if(node[0] === "type1"){
                btnAdd.classList.remove("disabled");
                btnAdd.title = "Agregar país";
                btnDelete.classList.remove("disabled");
                btnDelete.title = "Borrar región";
                btnEdit.classList.remove("disabled");
                btnEdit.title = "Editar región";
                SelectedNode = regionsArray.find( region => node[1] === region.name);
                SelectedNodeType = 1;
            }
            if(node[0] === "type2"){
                btnAdd.classList.remove("disabled");
                btnAdd.title = "Agregar ciudad";
                btnDelete.classList.remove("disabled");
                btnDelete.title = "Borrar país";
                btnEdit.classList.remove("disabled");
                btnEdit.title = "Editar país";
                SelectedNode = countriesArray.find( country => node[1] === country.name);
                SelectedNodeType = 2;
            }
            if(node[0] === "type3"){
                btnAdd.classList.add("disabled");
                btnDelete.classList.remove("disabled");
                btnDelete.title = "Borrar ciudad";
                btnEdit.classList.remove("disabled");
                btnEdit.title = "Editar ciudad";
                SelectedNode = citiesArray.find( city => node[1] === city.name);
                SelectedNodeType = 3;
            }
            if(node[0] === "root"){
                btnAddNode.classList.remove("disabled");
                btnAddNode.title = "Agregar región";
                btnDelete.classList.add("disabled");
                btnEdit.classList.add("disabled");
                SelectedNodeType = node[0];
            }
        }
        

    });

    // funcionalidad para expander todo el arbol
    $('#expander_todos').on('click', function () {
        $('#jstree').jstree("open_all");
    });

    // funcionalidad para contraer todo el arbol
    $('#contraer_todos').on('click', function () {
        $('#jstree').jstree("close_all");
    });
}



//-----> Funcion para eliminar los nodos pertenecientes al arbol
function clearNodesList(){    
    $('#jstree').jstree("destroy");
}


//------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------->  BORRADO DE UBICACIONES

let regionNo = document.getElementById("region-no");
regionNo.addEventListener("click", closeDeleteNodeConfirmation );
let regionYes = document.getElementById("region-yes");
let countryYes = document.getElementById("country-yes");
let cityYes = document.getElementById("city-yes");
regionYes.addEventListener("click", deleteNode );
countryYes.addEventListener("click", deleteNode );
cityYes.addEventListener("click", deleteNode );



//-----> Funcion para mostrar el modal de confirmacion de eliminacion
function showDeleteNodeConfirmation(){    
    backgroundModalsManage();
    showYesButton(SelectedNodeType);
    let confirmation = document.getElementById("confirmation-reg");
    confirmation.classList.remove("disabled");
    let question = document.getElementById("question-reg");
    if(SelectedNodeType === 1){
        question.textContent = `¿Estas seguro que deseas borrar la región ${SelectedNode.name}?`;
    }
    if(SelectedNodeType === 2){
        question.textContent = `¿Estas seguro que deseas borrar el país ${SelectedNode.name}?`;
    }
    if(SelectedNodeType === 3){
        question.textContent = `¿Estas seguro que deseas borrar la ciudad ${SelectedNode.name}?`;
    }
}

//-----> Funcion para mostrar los botones de operacion segun el tipo de nodo que se trate
function showYesButton(type){
    if(type === 1){
        regionYes.classList.remove("disabled");
        countryYes.classList.add("disabled");
        cityYes.classList.add("disabled");
    }
    if(type === 2){
        regionYes.classList.add("disabled");
        countryYes.classList.remove("disabled");
        cityYes.classList.add("disabled");
    }
    if(type === 3){
        regionYes.classList.add("disabled");
        countryYes.classList.add("disabled");
        cityYes.classList.remove("disabled");
    }
}


//-----> Funcion para efectuar el cierre del modal de confirmacion de eliminacion
function closeDeleteNodeConfirmation(){
    backgroundModalsManage();
    let confirmation = document.getElementById("confirmation-reg");
    confirmation.classList.add("disabled");
}


//-----> Funcion para llamar al servicio de eliminacion del usuario
async function deleteNode(){
    closeDeleteNodeConfirmation();
    operationSpinner.classList.remove("disabled");
    let message = "";
    switch(SelectedNodeType){
        case 1:
                await deleteRegion(SelectedNode);
                message = "La región fue borrada exitosamente";
                break;
        case 2:
                await deleteCountry(SelectedNode);
                message = "El país fue borrado exitosamente";
                break;
        case 3:
                await deleteCity(SelectedNode);
                message = "La ciudad fue borrada exitosamente";
                break;
        default:
                break;
    }
    
    operationSpinner.classList.add("disabled");        
    toggleNotificacionModal(message);    
}

//-----> Funcion para borrar una regiones en cadena, incluye borrado de pais y ciudad si las tiene como hijos.
async function deleteRegion(ubication){
    countriesArray.forEach( async country => {
        if(country.region_id === ubication.id){
            await deleteCountry(country);
        }          
    });
    await deleteRegionService(ubication.id);
}

//-----> Funcion para borrar una paises en cadena, incluye borrado de ciudad si las tiene como hijos.
async function deleteCountry(ubication){
    citiesArray.forEach( async city => {
        if(city.country_id === ubication.id)
            await deleteCity(city);
    });
    await deleteCountryService(ubication.id);
}

//-----> Funcion para borrar una ciudad 
async function deleteCity(ubication){
    await deleteCityService(ubication.id);
}



//------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------->  AGREGAR UBICACION
let btnCancelUbication = document.getElementById("cancel-ubication");
btnCancelUbication.addEventListener("click", closeUbicationForm );

let btnCreateUbication = document.getElementById("create-ubication");
btnCreateUbication.addEventListener("click", addUbication );

let inputUbicationName = document.getElementById("ubications-modal-name");
inputUbicationName.addEventListener("focus", () => { inputUbicationName.classList.add("border-default"); inputUbicationName.classList.remove("border-no-content");})

//-----> Funcion para mostrar el formulario para agregar la nueva ubicacion (nodo del arbol)
function showUbicationForm( ubication ){
    backgroundModalsManage();
    let ubicationsModal = document.getElementById("ubications-modal");
    ubicationsModal.classList.remove("disabled");
    
    // si no tiene ubicacion es porque es una creacion de ubicacion
    if(!ubication){
        btnCreateUbication.classList.remove("disabled");
        btnUpdateUbication.classList.add("disabled");
        setUbicationModalTitle("AGREGAR");
    } else{
        // si tiene ubicacion es una actualizacion
        btnCreateUbication.classList.add("disabled");
        btnUpdateUbication.classList.remove("disabled");
        inputUbicationName.value = SelectedNode.name;
        setUbicationModalTitle("ACTUALIZAR");
    }
}

//-----> Funcion para agregar el titulo del formulario
function setUbicationModalTitle(action){
    let title = document.getElementById("ubications-modal-title");
    switch(SelectedNodeType){
        case "root":
            title.textContent = `${action} REGIÓN`;
            break;
        case 1:
            title.textContent = action === "AGREGAR" ? `${action} PAÍS` : `${action} REGIÓN`;
            break;
        case 2:
            title.textContent = action === "AGREGAR" ? `${action} CIUDAD` : `${action} PAÍS`;
            break;
        case 3:
            title.textContent = `${action} CIUDAD`;
            break;
    }
}

//-----> Funcion para cerrar el formulario
function closeUbicationForm(){
    backgroundModalsManage();
    let ubicationsModal = document.getElementById("ubications-modal");
    ubicationsModal.classList.add("disabled");
}


//-----> Funcion para agregar una nueva ubicacion al arbol, puede ser region, pais o ciudad
async function addUbication(){
    if(inputUbicationName.value){
        closeUbicationForm();
        operationSpinner.classList.remove("disabled");
        console.log("selectedNode ",SelectedNode);
        switch(SelectedNodeType){
            case "root":
                regionRequest = {
                    name: inputUbicationName.value
                }
                await addRegionService(regionRequest);
                break;

            case 1:
                countryRequest = {
                    name: inputUbicationName.value,
                    regionId: SelectedNode.id
                }
                await addCountryService(countryRequest);
                break;
            case 2:
                cityRequest = {
                    name: inputUbicationName.value,
                    countryId: SelectedNode.id
                }
                await addCityService(cityRequest);
                break;
        }
        operationSpinner.classList.add("disabled");
        inputUbicationName.value = "";
    } else{
        inputUbicationName.classList.remove("border-default");
        inputUbicationName.classList.add("border-no-content");
        console.log("Complete los campos obligatorios")
    }

}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------->  ACTUALIZAR UBICACION
let btnUpdateUbication = document.getElementById("update-ubication");
btnUpdateUbication.addEventListener("click", updateUbication );

//-----> Funcion para llamar a los servicios de moficacion de ubicacion, puede ser region, pais o ciudad
async function updateUbication(){
    if(inputUbicationName.value){
        closeUbicationForm();
        operationSpinner.classList.remove("disabled");
        console.log("selectedNode ",SelectedNode);
        switch(SelectedNodeType){
            case 1:
                regionRequest = {
                    id: SelectedNode.id,
                    name: inputUbicationName.value
                }
                await updateRegionService(regionRequest);
                break;

            case 2:
                countryRequest = {
                    id: SelectedNode.id,
                    name: inputUbicationName.value,
                    regionId: SelectedNode.region_id
                }
                await updateCountryService(countryRequest);
                break;
            case 3:
                cityRequest = {
                    id: SelectedNode.id,
                    name: inputUbicationName.value,
                    countryId: SelectedNode.country_id
                }
                await updateCityService(cityRequest);
                break;
        }
        operationSpinner.classList.add("disabled");
        inputUbicationName.value = "";
    } else{
        inputUbicationName.classList.remove("border-default");
        inputUbicationName.classList.add("border-no-content");
        console.log("Complete los campos obligatorios")
    }
}
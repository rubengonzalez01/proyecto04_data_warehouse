# DATA WAREHOUSE
- El proyecto es una herramienta web que está orientado a una compañía de Marketing. 
- La finalidad es que facilite la administración de todos los contactos de sus clientes, los cuales se agrupan por las compañías en las que trabajan. 

## Pasos para instalación

1- Bajar el proyecto:
  * Desde una terminal en un nuevo workspace ejecutar:
>     git clone https://github.com/rubengonzalez01/proyecto04_data_warehouse.git
	
2- Se requiere tener un servidor de base de datos MySQL. Utilizar un cliente de base de datos adecuado y conectarse con usuario con permisos de administador (root). 

3- Ejecutar el fichero **script_data_warehouse.sql**. El mismo se encuentra en el directorio **/proyecto04_data_warehouse/documentacion/sql**. Allí se encuentran los scripts necesarios para generar la estructura de la base de datos junto con el usuario de servicio utilizado por la aplicación. El puerto sobre el que debe conectarse la base de datos es el 3306. Quedando el string de conexión a la base de datos de la siguiente manera:

>	mysql://dataware_usr:mysql@localhost:3306/data_warehouse

4- Una vez creada la estructura de la base de datos, levantamos desde VSCode la raiz del proyecto, el directorio **/proyecto04_data_warehouse**

5- Nos ubicamos en el path **/proyecto04_data_warehouse/dev/backend/** y para bajar las dependencias ejecutamos el comando:

> 	npm i

6- Descargadas todas las dependencias, debemos inicializar el servidor del Data Warehouse. Ejecutar el comando:

>	node appServer.js

7- Hecho esto, verificar que el servidor indique en la consola que se ha inicializado en el puerto 3000 y se ha conectado en la base de datos.

8- Si todos los pasos fueron correctos, el servidor ya se encuentra disponible para ser utilizado.

9- Por último, para poder efectuar la pruebas el proyecto incorpora 2 usuarios para las mismas:

 * Perfil: Administrador
	* usuario: rubgonzalez
 	* password: 111222
 
 
 * Perfil: Contactos
 	* usuario: contacto
 	* password: 123456
 


FIN

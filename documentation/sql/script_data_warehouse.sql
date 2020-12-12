-- Script de Base de datos del proyecto 04 de Acamica: Data Warehouse
-- Autor: Rubén González
-- https://www.linkedin.com/in/ing-ruben-j-gonzalez/
-- Dic 2020


-- Creacion de la base de datos
create database data_warehouse;
use data_warehouse;


-- Creo el usuario de servicio que utilizara la aplicacion y le doy permisos sobre la base de datos data_warehouse
create user 'dataware_usr'@'localhost' identified by 'mysql';
grant all privileges on data_warehouse.* to 'dataware_usr'@'localhost';
commit;


-- creacion de tabla profiles y carga de datos
create table profiles(
	id integer not null,
	name varchar(50) not null,
	description varchar(255) not null,
	primary key (id)
);
insert into profiles(id, name, description) values(1, 'Contactos', 'Puede realizar todas las acciones sobre los contactos pero no puede crear usuarios.');
insert into profiles(id, name, description) values(2, 'Administrador', 'Usuario de la app con permisos de administador. También crear nuevos usuarios.');
commit;



-- creacion de tabla user y carga de datos
create table users(
	username varchar(30),
	firstname varchar(50) not null,
	lastname varchar(50) not null,
	mail varchar(50) not null,
	password varchar(50) not null,
	profile_id integer not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	primary key(username),
	foreign key(profile_id) references profiles(id)
);
insert into users(username, firstname, lastname, mail, password, profile_id, is_active)
values('rubgonzalez', 'Ruben', 'Gonzalez', 'rubengonzalez@gmail.com', '111222', 2, 'true');
values('contacto', 'Ruben', 'Contacto', 'rubencontacto@gmail.com', '123456', 1, 'true');
commit;


-- creacion de tabla regions y carga de datos
create table regions(
	id integer not null auto_increment,
	name varchar(50) not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	primary key(id)
);
insert into regions(name, is_active) values('Sudamérica', 'true');
insert into regions(name, is_active) values('Norteamérica', 'true');
commit;


-- creacion de tabla countries y carga de datos
create table countries(
	id integer not null auto_increment,
	name varchar(50) not null,
	region_id integer not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	primary key(id),
	foreign key(region_id) references regions(id)
);
insert into countries(name, region_id, is_active) values('Argentina', 1, 'true');
insert into countries(name, region_id, is_active) values('Colombia', 1, 'true');
insert into countries(name, region_id, is_active) values('Chile', 1, 'true');
insert into countries(name, region_id, is_active) values('Uruguay', 1, 'true');
insert into countries(name, region_id, is_active) values('México', 2, 'true');
insert into countries(name, region_id, is_active) values('Estados Unidos', 2, 'true');
commit;


-- creacion de tabla cities y carga de datos
create table cities(
	id integer not null auto_increment,
	name varchar(50) not null,
	country_id integer not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	primary key(id),
	foreign key(country_id) references countries(id)
);
insert into cities(name, country_id, is_active) values('Buenos Aires', 1, 'true');
insert into cities(name, country_id, is_active) values('Córdoba', 1, 'true');
insert into cities(name, country_id, is_active) values('Bogotá', 2, 'true');
insert into cities(name, country_id, is_active) values('Cúcuta', 2, 'true');
insert into cities(name, country_id, is_active) values('Medellín', 2, 'true');
insert into cities(name, country_id, is_active) values('Atacama', 3, 'true');
insert into cities(name, country_id, is_active) values('Santiago', 3, 'true');
insert into cities(name, country_id, is_active) values('Valparaiso', 3, 'true');
insert into cities(name, country_id, is_active) values('Canelones', 4, 'true');
insert into cities(name, country_id, is_active) values('Maldonado', 4, 'true');
insert into cities(name, country_id, is_active) values('Montevideo', 4, 'true');
insert into cities(name, country_id, is_active) values('Ciudad de México', 5, 'true');
insert into cities(name, country_id, is_active) values('Tijuana', 5, 'true');
insert into cities(name, country_id, is_active) values('Florida', 6, 'true');
insert into cities(name, country_id, is_active) values('Texas', 6, 'true');
commit;


-- creacion de tabla companies y carga de datos
create table companies(
	id integer not null auto_increment,
	name varchar(80) not null,
	address varchar(100) not null,
	phone varchar(20) not null,
	mail varchar(50) not null,
	city_id integer not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	primary key(id),
	foreign key(city_id) references cities(id)
);
insert into companies(name, address, phone, mail, city_id, is_active) values('Softtek', 'Blvd. Constitución 3098, piso 6', '+52 (81) 1932 4400', 'info@softtek.com', 12, 'true');
insert into companies(name, address, phone, mail, city_id, is_active) values('Mercado Libre', 'Av. Caseros 3039, piso 2', '4640-8000', 'info@mercadolibre.com.ar', 1, 'true');
insert into companies(name, address, phone, mail, city_id, is_active) values('Globant', 'Humberto 1º 53', '011 4109-1700', 'info@globant.com.ar', 1, 'true');
insert into companies(name, address, phone, mail, city_id, is_active) values('Rappi', 'Cl. 26 Nte.', '+57 302 3815380', 'info@rappi.com', 3, 'true');
commit;


-- creacion de tabla contact_channels y carga de datos
create table contact_channels(
	id integer not null,
	name varchar(50) not null,
	primary key(id)
);
insert into contact_channels(id, name) values(1, 'Teléfono');
insert into contact_channels(id, name) values(2, 'Whatsapp');
insert into contact_channels(id, name) values(3, 'Instagram');
insert into contact_channels(id, name) values(4, 'Facebook');
insert into contact_channels(id, name) values(5, 'Linkedin');
commit;



-- creacion de tabla preferences y carga de datos
create table preferences(
	id integer not null,
	name varchar(50) not null,
	primary key(id)
);
insert into preferences(id, name) values(1, 'Sin preferencia');
insert into preferences(id, name) values(2, 'Canal favorito');
insert into preferences(id, name) values(3, 'No molestar');
commit;



-- creacion de tabla contacts
create table contacts(
	id integer not null auto_increment,
	creation_date timestamp not null,
	firstname varchar(50) not null,
	lastname varchar(50) not null,
	position varchar(50) not null,	
	mail varchar(50) not null,
	address varchar(100) not null,
	interest integer not null,
	is_active varchar(5) not null,
	delete_date timestamp,
	company_id integer not null,
	city_id integer not null,
	primary key(id),
	foreign key(company_id) references companies(id),
	foreign key(city_id) references cities(id)
);
commit;


-- creacion de tabla contacts_contact_channels
create table contacts_contact_channels(
	contact_id integer not null,
	contact_channel_id integer not null,	
	preference_id integer not null,
	account varchar(150) not null,
	primary key(contact_id, contact_channel_id),
	foreign key(contact_id) references contacts(id),
	foreign key(contact_channel_id) references contact_channels(id),
	foreign key(preference_id) references preferences(id)
);
commit;

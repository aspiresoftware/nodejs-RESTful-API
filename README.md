# nodejs-RESTful-API

Install node modules
* npm install

Change server and DB configurations in /config/settings.js :
* Change port no at line no #5
* Change Database name at line no #10, and create empty databse having same name in mySql
* Change username and password according to mySql at line no. #11, #12

Set DB and tables :
* node tasks/reset

Install nodemon globally for live-reload of the server after changing code
* npm install -g nodemon

Start the node server :
* ./bin/start
* server will be start at port no. which is mentioned in the settings.js file

For starting server with debugging options :
* node-debug server.js

For starting swagger :
Open url http://{id_address}:{port_no}/swagger/

To add REST url in swagger, add REST url realated information in /api/api.js file.

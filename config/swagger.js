var swagger     = require('swagger-express');
var settings    = require('./settings.js');
var api = require('../api/api');

module.exports = function(app) {
  app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:' + settings.port,
    info: {
      title: 'swagger-express sample app',
      description: 'Swagger + Express = {swagger-express}'
    },
    apis: ['./api/api.js'],
    middleware: function(req, res){
    }
  }));
};
/**
 * This is main file from where the server is getting started
 * We have used express framework
 */

// Inject node module dependencies
var express     = require('express');
var path        = require('path');
var colors      = require('colors');
var settings    = require('./config/settings');
var environment = require('./config/environment');
var routes      = require('./config/routes');
var models      = require('./app/models/');
var swagger     = require('./config/swagger.js');

module.exports.start = function (done) {
  // cerate express app
  var app = express();

  // Set environment
  environment(app);

  // integrate swagger
  swagger(app);

  // Set routing
  routes(app);

  // Listen to port
  app.listen(settings.port, function () {
    console.log( ("Listening on port " + settings.port).green );

    if (done) {
      return done(null, app, server);
    }
  }).on('error', function (e) {
    // Show error is port is already in use
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use. Is the server already running?'.red);
    }
    if (done) {
      return done(e);
    }
  });
};

// If someone ran: "node server.js" then automatically start the server
if (path.basename(process.argv[1],'.js') == path.basename(__filename,'.js')) {
  module.exports.start();
}
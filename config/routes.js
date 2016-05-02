/**
 * This file configures routing mechanism
 */

// Inject node module dependencies
var controllers = require('../app/controllers');
var helpers = require('../app/utility');
var express = require('express');
var jwt = require('jsonwebtoken');

module.exports = function (app) {

  // API ROUTES -------------------

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, POST, PUT, DELETE");
    next();
  });

  // get an instance of the router for api routes
  var apiRoutes = express.Router();

  // Define public routes
  // This routes does not require token
  apiRoutes.post('/forgotpassword', controllers.authentication.forgotPassword);
  apiRoutes.post('/user', controllers.user.create);
  apiRoutes.post('/authenticate', controllers.authentication.authenticate);

  function autheticationMiddleware(req, res, next) {
    // check header or url parameters or post parameters for token
    var header = req.headers.authorization;
    var prefix = header.split(' ')[0];
    var token = header.split(' ')[1];

    // check for autheticated user
    // route middleware to verify a token
    if (prefix == 'Bearer') {
      // decode token
      if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {
          if (err) {
            return res.status(helpers.error.status.AuthenticationTimeout).send({error: helpers.error.message.AuthenticationTimeout});
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      } else {
        // if there is no token
        // return an error
        return res.status(helpers.error.status.Forbidden).send({error: helpers.error.message.Forbidden});
      }
    }
  }

  // Define private routes
  // This routes requires token
  apiRoutes.get('/users', autheticationMiddleware, controllers.user.list);
  apiRoutes.get('/user/:id', autheticationMiddleware, controllers.user.get);
  apiRoutes.put('/user/:id', autheticationMiddleware, controllers.user.update);
  apiRoutes.delete('/user/:id', autheticationMiddleware, controllers.user.remove);
  apiRoutes.put('/changepassword/:id', autheticationMiddleware, controllers.authentication.changePassword);
  apiRoutes.delete('/logout', autheticationMiddleware, controllers.authentication.logout);

  // Add prefix to routes
  app.use('/api/v1', apiRoutes);
};

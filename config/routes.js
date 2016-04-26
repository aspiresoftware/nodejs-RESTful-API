/**
 * This file configures routing mechanism
 */

// Inject node module dependencies
var controllers = require('../app/controllers');
var express = require('express');
var jwt = require('jsonwebtoken');
var utility = require('../app/utility/');

module.exports = function (app) {

  // API ROUTES -------------------

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
  });

  // get an instance of the router for api routes
  var apiRoutes = express.Router();

  // Define public routes
  // This routes does not require token
  apiRoutes.post('/forgot', utility.mail.sendMail);
  apiRoutes.post('/forgot/password', controllers.authentication.forgotPassword);
  apiRoutes.post('/user', controllers.user.create);
  apiRoutes.post('/authenticate', controllers.authentication.authenticate);

  // route middleware to verify a token
  apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var header = req.headers.authorization;
    var prefix = header.split(' ')[0];
    var token = header.split(' ')[1];

    // check for autheticated user
    if (prefix == 'Bearer') {
      // decode token
      if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {
          if (err) {
            return res.json({ status: 419, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
      }
    }
  });

  // Define private routes
  // This routes requires token
  apiRoutes.get('/users', controllers.user.list);
  apiRoutes.put('/user/:id', controllers.user.update);
  apiRoutes.delete('/user/:id', controllers.user.remove);

  // Add prefix to routes
  app.use('/api', apiRoutes);
};

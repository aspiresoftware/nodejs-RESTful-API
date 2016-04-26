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
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, 'superSecret', function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
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
  });

  // Define private routes
  // This routes requires token
  apiRoutes.get('/users', controllers.user.list);
  apiRoutes.put('/user/:id', controllers.user.update);
  apiRoutes.delete('/user/:id', controllers.user.remove);

  // Add prefix to routes
  app.use('/api', apiRoutes);
};

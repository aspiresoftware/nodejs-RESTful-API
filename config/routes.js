
var controllers = require('../app/controllers');
var express = require('express');
var jwt = require('jsonwebtoken');
var utility = require('../app/utility/');

module.exports = function (app) {

  // API ROUTES -------------------

  // get an instance of the router for api routes
  var apiRoutes = express.Router();

  apiRoutes.post('/forgot/password', utility.mail.sendMail);
  apiRoutes.post('/user', controllers.user.create);
  apiRoutes.post('/authenticate', controllers.authentication.authenticate);

  // route middleware to verify a token
  /*apiRoutes.use(function(req, res, next) {

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
  });*/

  apiRoutes.get('/users', controllers.user.list);
  apiRoutes.put('/user/:id', controllers.user.update);
  apiRoutes.delete('/user/:id', controllers.user.remove);

  app.use('/api', apiRoutes);
};

/**
 * This file contains authentication related implementation
 */

// Inject node module dependencies
var _       = require('lodash');
var orm     = require('orm');
var helpers = require('../utility');
var log = require('../../config/logger.js');

module.exports = {
  // Authenticate user
  authenticate: function (req, res, next) {
    var params = req.body;
    if (req.headers.authorization) {
      var athorizationToken = req.headers.authorization.split(" ")[1];
      // Check whether params have key grant_type or not
      if (params.grantType == 'password') {
        // if yes, then it will verify username and password
        // and then give access and refresh token

        // get values from request header
        var buf = new Buffer(athorizationToken, 'base64');
        var loginCredentials = {};
        loginCredentials.username = buf.toString().split(':')[0];
        loginCredentials.password = buf.toString().split(':')[1];

        log.info("crendentials = " + loginCredentials.username + ' ' + loginCredentials.password);
        req.models.user.find({
          username: loginCredentials.username,
          isActivate: true,
          isDeleted: false
        }, function(err, userList) {
          if(err) {
            if(Array.isArray(err)) {
              return res.status(helpers.error.errorStatus.InternalServerError).send({ errors: helpers.error.formatErrors(err) });
            } else {
              return res.status(helpers.error.errorStatus.InternalServerError).send({ errors: err });
            }
          }
          if(userList && Array.isArray(userList) && userList.length <= 0){
            return res.status(helpers.error.errorStatus.Unauthorized).send({ errors: helpers.error.errorMessages.usernameNotFound });
          } else if (userList && Array.isArray(userList) && userList.length > 0) {
            if (userList[0].password === loginCredentials.password) {
              // if user is found and password is right
              // create an access token
              var user = helpers.util.createAuthToken(userList[0]);
              params.accessToken = user.accessToken;
              params.refreshToken = user.refreshToken;
              params.user_id = user.id;
              params.ipAddress = req.connection.remoteAddress;
              params.userAgent = req.headers['user-agent'];

              req.models.authToken.create(params, function (err, loggedUser) {
                if(err) {
                  if(Array.isArray(err)) {
                    return res.status(helpers.error.errorStatus.InternalServerError).send({ errors: helpers.error.formatErrors(err) });
                  } else {
                    return next(err);
                  }
                }
                return res.status(helpers.error.errorStatus.OK).send(loggedUser.serialize());
              });
            } else {
              return res.status(helpers.error.errorStatus.Unauthorized).send({ error: helpers.error.errorMessages.invalidPassword });
            }
          } else {
            return res.status(helpers.error.errorStatus.Unauthorized).send({ errors: helpers.error.errorMessages.usernameNotFound });
          }     
        });
      } else if(params.grantType == 'accessToken') {
        // if no, then it will verify refresh token
        // adn then generate new access token
        req.models.authToken.find({refreshToken: athorizationToken}, function(err, userList) {
          if(err) {
            if(Array.isArray(err)) {
              return res.status(helpers.error.errorStatus.InternalServerError).send({ errors: helpers.error.formatErrors(err) });
            } else {
              return next(err);
            }
          }
          if(userList && Array.isArray(userList) && userList.length > 0){
            var user = userList[0];
            // generate new access token
            user = helpers.util.createAuthToken(user);
            // save newly generated access and refresh token
            req.models.authToken.get(user.id, function (err, currUser) {
              currUser.save(user, function (err) {
                log.info("User "+ currUser.id +" updated with new tokens!");
                return res.status(helpers.error.errorStatus.OK).send(user.serialize());
              });
            });
          } else{
            return res.status(helpers.error.errorStatus.Unauthorized).send({ error: helpers.error.errorMessages.invalidToken });
          }
        });
      } else {
        return res.status(helpers.error.errorStatus.Unauthorized).send({ error: helpers.error.errorMessages.grantTypeNotFound });
      }
    } else {
      return res.status(helpers.error.errorStatus.Unauthorized).send({ error: helpers.error.errorMessages.authorizationNotFound });
    }
  },
  // change password
  forgotPassword: function(req, res, next) {
    var params = req.body;
    req.models.login.find({username: params.username}).each(function(user) {
      user.password = params.password;
      req.models.login.get(user.id, function(err, currUser) {
        currUser.save(user, function(err) {
          log.info("password changed");
          return res.status(helpers.error.errorStatus.OK).send(user.serialize());
        });
      });
    });
  },
  // logout
  logout: function(req, res, next) {
    var athorizationToken = req.headers.authorization.split(" ")[1];
    req.models.authToken.find({ accessToken: athorizationToken }).remove(function(err){
      if(err) {
        return res.status(helpers.error.errorStatus.InternalServerError).send({error: 'Error while logging out'});
      }
      return res.status(helpers.error.errorStatus.OK).send({ message: 'Successfully logged out'});
    });
  }
};
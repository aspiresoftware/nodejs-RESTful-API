/**
 * This file contains authentication related implementation
 */

// Inject node module dependencies
var _       = require('lodash');
var orm     = require('orm');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var helpers = require('../utility');

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
        console.log(loginCredentials.username + ' ' + loginCredentials.password);
        console.log(params.username + ' ' + params.password);
        if (loginCredentials.username == params.username && loginCredentials.password == params.password) {
          req.models.user.find({
            username: loginCredentials.username,
            isActivate: true,
            isDeleted: false
          }, function(err, userList) {
            if(err) {
              if(Array.isArray(err)) {
                return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
              } else {
                /*return next(err);*/
                return res.status(500).send({ errors: err });
              }
            }
            if(Array.isArray(userList)) {
              console.log(userList);
              console.log(userList[0].password + ' ' + loginCredentials.password);
              if (userList[0].password === loginCredentials.password) {
                // if user is found and password is right
                // create an access token
                var random = crypto.randomBytes(10).toString('hex');
                var userRandom = {};
                userRandom.id = userList[0].id;
                userRandom.random = random;
                var accessToken = jwt.sign(userRandom, 'superSecret', {
                  expiresIn: 40
                });
                // generate refresh token
                var refreshToken = crypto.randomBytes(40).toString('hex');
                params.accessToken = accessToken;
                params.refreshToken = refreshToken;
                params.user_id = userList[0].id;
                params.ipAddress = req.connection.remoteAddress;
                params.userAgent = req.headers['user-agent'];

                req.models.authToken.create(params, function (err, loggedUser) {
                  if(err) {
                    if(Array.isArray(err)) {
                      return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
                    } else {
                      return next(err);
                    }
                  }
                  return res.status(200).send(loggedUser.serialize());
                });
              } else {
                return res.status(500).send({ error: 'Password is invalid' });
              }
            }
          });
        } else {
          return res.status(500).send({ error: 'Wrong crendentials' });
        }
      } else if(params.grantType == 'accessToken') {
        // if no, then it will verify refresh token
        // adn then generate new access token
        req.models.authToken.find({refreshToken: athorizationToken}, function(err, userList) {
          if(err) {
            if(Array.isArray(err)) {
              return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
            } else {
              return next(err);
            }
          }
          if(Array.isArray(userList)) {
            var user = userList[0];
            // generate new access token
            var random = crypto.randomBytes(10).toString('hex');
            var userRandom = {};
            userRandom.id = userList[0].id;
            userRandom.random = random;
            var accessToken = jwt.sign(userRandom, 'superSecret', {
              expiresIn: 60
            });
            user.accessToken = accessToken;
            var refreshToken = crypto.randomBytes(40).toString('hex');
            user.refreshToken = refreshToken;
            // save newly generated access and refresh token
            req.models.authToken.get(user.id, function (err, currUser) {
              currUser.save(user, function (err) {
                console.log("saved!");
                return res.status(200).send(user.serialize());
              });
            });
          }
        });
      } else {
        return res.status(500).send({ error: 'No grantType is provided' });
      }
    } else {
      return res.status(500).send({ error: 'No Authorization header is provided' });
    }
  },
  // change password
  forgotPassword: function(req, res, next) {
    var params = req.body;
    req.models.login.find({username: params.username}).each(function(user) {
      user.password = params.password;
      req.models.login.get(user.id, function(err, currUser) {
        currUser.save(user, function(err) {
          console.log("password changed");
          return res.status(200).send(user.serialize());
        });
      });
    });
  },
  // logout
  logout: function(req, res, next) {
    var athorizationToken = req.headers.authorization.split(" ")[1];
    req.models.authToken.find({ accessToken: athorizationToken }).remove(function(err){
      if(err) {
        return res.status(500).send({error: 'Error while logging out'});
      }
      return res.status(200).send({ message: 'Successfully logged out'});
    });
  }
};
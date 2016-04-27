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

    var athorizationToken = req.headers.authorization.split(" ")[1];

    // Check whether params have key grant_type or not
    if (!params.grant_type) {
      // if yes, then it will verify username and password
      // and then give access and refresh token

      /*params.username = new Buffer(params.username, 'base64').toString();
      params.password = new Buffer(params.password, 'base64').toString();*/

      // get values from request header
      var buf = new Buffer(athorizationToken, 'base64');
      var loginCredentials = {};
      loginCredentials.username = buf.toString().split(':')[0];
      loginCredentials.password = buf.toString().split(':')[1];

      /*if (params.username == loginCredentials.username && params.password == loginCredentials.password) {*/
        req.models.login.find({ username: loginCredentials.username }).each(function (user) {
          if (user.password === loginCredentials.password) {
            // if user is found and password is right
            // create an access token
            var accessToken = jwt.sign(user, 'superSecret', {
              expiresIn: 300
            });
            // generate refresh token
            var refreshToken = crypto.randomBytes(40).toString('hex');
            req.models.login.get(user.id, function (err, currUser) {
              currUser.accessToken = accessToken;
              currUser.refreshToken = refreshToken;
              currUser.save(user, function (err) {
                console.log("saved!");
                return res.status(200).send(user.serialize());
              });
            });
          }
        });
      /*}*/
    } else {
      // if no, then it will verify refresh token
      // adn then generate new access token
      req.models.login.find({ refreshToken: athorizationToken }).each(function(user) {
        // generate new access token
        var accessToken = jwt.sign(user, 'superSecret', {
          expiresIn: 300
        });
        user.accessToken = accessToken;
        var refreshToken = crypto.randomBytes(40).toString('hex');
        user.refreshToken = refreshToken;
        // save newly generated access and refresh token
        req.models.login.get(user.id, function (err, currUser) {
          currUser.save(user, function (err) {
            console.log("saved!");
            return res.status(200).send(user.serialize());
          });
        });
      });
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
  }
};
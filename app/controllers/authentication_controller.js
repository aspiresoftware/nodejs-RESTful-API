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
    var athorizationToken = req.headers.athorization;
    // get values from request body
    var params = req.body;
    // Check whether params have key grant_type or not
    if (!params.grant_type) {
      // if yes, then it will verify username and password
      // and then give access and refresh token
      req.models.login.find({ username: params.username }).each(function (user) {
        if (user.password === req.body.password) {
          // if user is found and password is right
          // create an access token
          var accessToken = jwt.sign(user, 'superSecret', {
            expiresIn: 300
          });
          user.accessToken = accessToken;
          // generate refresh token
          var refreshToken = crypto.randomBytes(40).toString('hex');
          user.refreshToken = refreshToken;
          req.models.login.get(user.id, function (err, currUser) {
            currUser.save(user, function (err) {
              console.log("saved!");
              return res.status(200).send(user.serialize());
            });
          });
        }
      });
    } else {
      // if no, then it will verify refresh token
      // adn then generate new access token
      req.models.login.find({ refreshToken: params.refreshToken }).each(function(user) {
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
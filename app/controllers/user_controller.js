/**
 * This file contains user related implementation
 */

// Inject node module dependencies
var _       = require('lodash');
var orm     = require('orm');
var helpers = require('../utility');

module.exports = {
  // get list of all users
  list: function (req, res, next) {
    req.models.user.find().limit(4).order('-id').all(function (err, users) {
      if (err) return next(err);

      var userList = users.map(function (currentUser) {
        return currentUser.serialize();
      });
      return res.status(200).send({ users: userList});
    });
  },
  // Save new user
  create: function (req, res, next) {
    var loginParams = _.pick(req.body, 'username', 'password');
    var params = _.pick(req.body, 'firstName', 'lastName');

    // save user
    req.models.user.create(params, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(200).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      // get user_id to save username and password in login
      loginParams.user_id = user.id;
      // save login credentials
      req.models.login.create(loginParams, function (err, user) {
        if(err) {
          if(Array.isArray(err)) {
            return res.status(200).send({ errors: helpers.utils.formatErrors(err) });
          } else {
            return next(err);
          }
        }
        return res.status(200).send(user.serialize());
      });
    });
  },
  // update user
  update: function (req, res, next) {
    var id = parseInt(req.params.id);
    var params = req.body;
    req.models.user.get(id, function (err, user) {
      user.save(params, function (err) {
        console.log("saved!");
        return res.status(200).send(user.serialize());
      });
    });
  },
  // delete user
  remove: function(req, res, next) {
    var id = parseInt(req.params.id);
    var params = {
      isActivate: false
    };
    req.models.user.get(id, function (err, user) {
      user.save(params, function (err) {
        console.log("removed!");
        return res.status(200).send(user.serialize());
      });
    });
  }
};

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
    req.models.user.find().all(function (err, users) {

      if(err) {
        if(Array.isArray(err)) {
          return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }

      // Serialize user into json
      var userList = users.map(function (currentUser) {
        return currentUser.serialize();
      });
      return res.status(200).send({ users: userList});
    });
  },

  // Save new user
  create: function (req, res, next) {
    var params = req.body;

    // save user
    req.models.user.create(params, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      return res.status(200).send(user.serialize());
    });
  },

  // update user
  update: function (req, res, next) {
    var id = parseInt(req.params.id);
    var params = req.body;
    req.models.user.get(id, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      user.save(params, function (err) {
        if(err) {
          if(Array.isArray(err)) {
            return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
          } else {
            return next(err);
          }
        }
        console.log("saved!" + user);
        return res.status(200).send(user.serialize());
      });
    });
  },

  // delete user
  remove: function(req, res, next) {
    var id = parseInt(req.params.id);
    var params = {
      isDeleted: true
    };
    req.models.user.get(id, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      user.save(params, function (err) {
        if(err) {
          if(Array.isArray(err)) {
            return res.status(500).send({ errors: helpers.utils.formatErrors(err) });
          } else {
            return next(err);
          }
        }
        console.log("removed!");
        return res.status(200).send(user.serialize());
      });
    });
  }
};

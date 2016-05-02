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
    helpers.util.setPageSize(req.models.user);
    req.models.user.pages(function (err, totalPages) {
      var pagination = helpers.util.pagination(req, totalPages);
      req.models.user.page(pagination.currentPage).run(function (err, users) {
        if(err) {
           return helpers.error.sendError(err, res, next);
        }
        // Serialize user into json
        var userList = users.map(function (currentUser) {
          return currentUser.serialize();
        });                                         
        return res.status(helpers.success.status.OK).send({ pages: totalPages, currentPage: pagination.currentPage, hasPrevious: pagination.hasPrevious, hasNext: pagination.hasNext,  users: userList});
      });
    });
  },

  // Get user details
  get: function (req, res, next) {
    var id = parseInt(req.params.id);
    req.models.user.get(id, function (err, user) {
      if(err) {
        return helpers.error.sendError(err, res, next);
      }                                  
      return res.status(helpers.success.status.OK).send(user.serialize());
    });
  },

  // Save new user
  create: function (req, res, next) {
    var params = req.body;
    req.models.user.count({ username: params.username }, function (err, count) {
      if(err) {
         return helpers.error.sendError(err, res, next);
      }
      if(count > 0) {
        return res.status(helpers.success.status.OK).send({ error: helpers.error.message.userExist });
      } else {
        // save user
        req.models.user.create(params, function (err, user) {
          if(err) {
             return helpers.error.sendError(err, res, next);
          }
          return res.status(helpers.success.status.OK).send(user.serialize());
        });
      }
    });
  },

  // update user
  update: function (req, res, next) {
    var id = parseInt(req.params.id);
    var params = req.body;
    req.models.user.get(id, function (err, user) {
      if(err) {
         return helpers.error.sendError(err, res, next);
      }
      user.save(params, function (err) {
        if(err) {
           return helpers.error.sendError(err, res, next);
        }
        return res.status(helpers.success.status.OK).send(user.serialize());
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
         return helpers.error.sendError(err, res, next);
      }
      user.save(params, function (err) {
        if(err) {
           return helpers.error.sendError(err, res, next);
        }
        return res.status(helpers.success.status.OK).send(user.serialize());
      });
    });
  }
};

var _       = require('lodash');
var orm     = require('orm');
var helpers = require('../utility');

module.exports = {
  list: function (req, res, next) {
    req.models.user.find().limit(4).order('-id').all(function (err, users) {
      if (err) return next(err);

      var userList = users.map(function (currentUser) {
        return currentUser.serialize();
      });
      return res.status(200).send({ users: userList});
    });
  },
  create: function (req, res, next) {
    var params = req.body;

    req.models.user.create(params, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(200).send({ errors: helpers.utils.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      return res.status(200).send(user.serialize());
    });
  },
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

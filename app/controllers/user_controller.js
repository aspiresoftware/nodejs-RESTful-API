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
  get: function (req, res, next) {

  }
};

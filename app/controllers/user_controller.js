var _       = require('lodash');
var orm     = require('orm');
var helpers = require('../utility');

module.exports = {
  list: function (req, res, next) {
    req.models.user.find().limit(4).order('-id').all(function (err, users) {
      if (err) return next(err);

      var items = users.map(function (currentUser) {
        return currentUser.serialize();
      });

      res.send({ items: items });
    });
  },
  create: function (req, res, next) {
    var params = _.pick(req.body, 'title', 'body');

    req.models.user.create(params, function (err, user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.send(200, { errors: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }

      return res.send(200, user.serialize());
    });
  },
  get: function (req, res, next) {

  }
};

var _       = require('lodash');
var orm     = require('orm');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var helpers = require('../utility');

module.exports = {
  authenticate: function (req, res, next) {
    var params = req.body;
    if (!params.grant_type) {
      req.models.user.find({ username: params.username }).each(function (user) {
        if (user.password === req.body.password) {
          // if user is found and password is right
          // create a token
          var accessToken = jwt.sign(user, 'superSecret', {
            expiresIn: 300
          });
          user.accessToken = accessToken;
          var refreshToken = crypto.randomBytes(40).toString('hex');
          user.refreshToken = refreshToken;
          req.models.user.get(user.id, function (err, currUser) {
            currUser.save(user, function (err) {
              console.log("saved!");
              return res.status(200).send(user.serialize());
            });
          });
        }
      });
    } else {
      req.models.user.find({ refreshToken: params.refreshToken }).each(function(user) {
        var accessToken = jwt.sign(user, 'superSecret', {
          expiresIn: 300
        });
        user.accessToken = accessToken;
        var refreshToken = crypto.randomBytes(40).toString('hex');
        user.refreshToken = refreshToken;
        req.models.user.get(user.id, function (err, currUser) {
          currUser.save(user, function (err) {
            console.log("saved!");
            return res.status(200).send(user.serialize());
          });
        });
      });
    }
  }
};
/**
 * This file contains authentication related implementation
 */

// Inject node module dependencies
var _       = require('lodash');
var orm     = require('orm');
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

        req.models.user.find({
          username: loginCredentials.username,
          isActivate: true,
          isDeleted: false
        }, function(err, userList) {
          if(err) {
            return helpers.error.sendError(err, res, next);
          }
          if(userList && Array.isArray(userList) && userList.length <= 0){
            return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.usernameNotFound });
          } else if (userList && Array.isArray(userList) && userList.length > 0) {
            if (userList[0].password === loginCredentials.password) {
              // if user is found and password is right
              // create an access token
              var user = helpers.util.createAuthToken(userList[0]);
              params.accessToken = user.accessToken;
              params.refreshToken = user.refreshToken;
              params.user_id = user.id;
              req.models.role.get(user.role_id, function(err, role) {
                if(err) {
                  return helpers.error.sendError(err, res, next);
                }
                params.rolename = role.rolename;
                params.ipAddress = req.connection.remoteAddress;
                params.userAgent = req.headers['user-agent'];

                req.models.authToken.create(params, function (err, loggedUser) {
                  if(err) {
                    return helpers.error.sendError(err, res, next);
                  }
                  return res.status(helpers.success.status.OK).send({user: userList[0].serialize() ,auth: loggedUser.serialize()});
                });
              });
            } else {
              return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.invalidPassword });
            }
          } else {
            return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.usernameNotFound });
          }
        });
      } else if(params.grantType == 'accessToken') {
        // if no, then it will verify refresh token
        // adn then generate new access token
        req.models.authToken.find({refreshToken: athorizationToken}, function(err, userList) {
          if(err) {
            return helpers.error.sendError(err, res, next);
          }
          if (userList && Array.isArray(userList) && userList.length > 0) {
            var user = userList[0];
            // generate new access token
            user = helpers.util.createAuthToken(user);
            // save newly generated access and refresh token
            req.models.authToken.get(user.id, function (err, currUser) {
              currUser.save(user, function (err) {
                return res.status(helpers.success.status.OK).send(user.serialize());
              });
            });
          } else {
            return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.invalidToken });
          }
        });
      } else {
        return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.grantTypeNotFound });
      }
    } else {
      return res.status(helpers.error.status.Unauthorized).send({ error: helpers.error.message.authorizationNotFound });
    }
  },

  // change password
  changePassword :  function(req, res, next) {
    var id = parseInt(req.params.id);
    console.log('id is'+id);
    var params = req.body;
    req.models.user.get(id, function (err, user) {
      if(err) {
         return helpers.error.sendError(err, res, next);
      }
      if (params.oldpassword === user.password) {
        console.log('password match');
        user.save({password: params.newpassword}, function (err) {
          if(err) {
             return helpers.error.sendError(err, res, next);
          }
          req.models.authToken.find({user_id:user.id}).remove(function (err) {
            if(err) {
              return helpers.error.sendError(err, res, next);
            }
            return res.status(helpers.success.status.OK).send({message: helpers.success.message.changePassword});
          });
        });
      } else {
        return res.status(helpers.success.status.OK).send({ error: helpers.error.message.wrongOldPassword });
      }
    });
  },

  // forgot password
  forgotPassword: function(req, res, next) {
    var params = req.body;
    req.models.user.find({ email: params.email }, function (err, user) {
      if(err) {
         return helpers.error.sendError(err, res, next);
      }
      if(user.length != 1) {
        return res.status(helpers.error.status.NotFound).send({ error: helpers.error.message.emailNotFound });
      } else {
        var newpass = helpers.util.passwordGenrator();
        // save user
        user[0].save({password: newpass}, function (err, user) {
          if(err) {
           return helpers.error.sendError(err, res, next);
          }
          helpers.mail.sendUpdatedPassword(user.email, user.firstname + ' ' + user.lastname, newpass, success, failure);
          function success() {
            return res.status(success.status.OK).send({message: success.message.passwordUpdated});
          }
          function failure() {
            return res.status(403).send({ 'mail': 'error'});
          }
        });
      }
    });
  },
  // logout
  logout: function(req, res, next) {
    var athorizationToken = req.headers.authorization.split(" ")[1];
    req.models.authToken.find({ accessToken: athorizationToken }).remove(function(err){
      if(err) {
        return helpers.error.sendError(err, res, next);
      }
      return res.status(helpers.success.status.OK).send({ message: helpers.success.message.loggedOut});
    });
  }
};
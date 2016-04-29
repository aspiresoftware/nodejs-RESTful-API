var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = {
  createAuthToken : function (user) {
    var random = crypto.randomBytes(10).toString('hex');
    var userRandom = {};
    userRandom.id = user.id;
    userRandom.random = random;
    var accessToken = jwt.sign(userRandom, 'superSecret', {
      expiresIn: 60
    });
    user.accessToken = accessToken;
    var refreshToken = crypto.randomBytes(40).toString('hex');
    user.refreshToken = refreshToken;
    return user;
  }
};

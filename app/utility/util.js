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
  },
  pagination: function (req, totalPages) {
    var page = req.query.page,
      previous = false,
      next = false;
    page = (page < 0) ? 1 : page;
    page = (totalPages < page) ? totalPages : page;
    previous = (page > 1) ? true : false;
    next = (page < totalPages) ? true: false;
    return {currentPage: page, hasPrevious: previous, hasNext: next};
  },
  setPageSize: function (model) {
    model.settings.set("pagination.perpage", 3);
  }
};

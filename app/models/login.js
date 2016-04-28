/**
 * OuthToken model
 */
var moment = require('moment');

module.exports = function (orm, db) {
  var AuthToken = db.define('authToken', {
    accessToken  : {type: 'text'},
    refreshToken : {type: 'text'},
    ipAddress    : {type: 'text'},
    userAgent    : {type: 'text'},
    createdAt    : { type: 'date', time: true },
    updatedAt    : { type: 'date', time: true }
  },
  {
    hooks: {
      beforeCreate: function() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
      },
      beforeSave: function() {
        this.updatedAt = new Date();
      }
    },
    methods: {
      serialize: function () {
        return {
          id           : this.id,
          accessToken  : this.accessToken,
          refreshToken : this.refreshToken,
          ipAddress    : this.ipAddress,
          userAgent    : this.userAgent,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow(),
        };
      }
    }
  });
  AuthToken.hasOne('user',
    db.models.user, { required: true, autoFetch: true, reverse: 'token'});
};

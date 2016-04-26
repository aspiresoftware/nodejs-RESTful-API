/**
 * Login model
 */
var moment = require('moment');

module.exports = function (orm, db) {
  var Login = db.define('login', {
    username     : { type: 'text', required: true },
    password     : { type: 'text', required: true },
    accessToken  : {type: 'text'},
    refreshToken : {type: 'text'},
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
          username     : this.username,
          password     : this.password,
          accessToken  : this.accessToken,
          refreshToken : this.refreshToken,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow(),
        };
      }
    }
  });
  Login.hasOne('user', db.models.user, { required: true, autoFetch: true });
};

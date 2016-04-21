var moment = require('moment');

module.exports = function (orm, db) {
  var User = db.define('user', {
    firstName    : { type: 'text', required: true },
    lastName     : { type: 'text', required: true },
    username     : { type: 'text', required: true },
    password     : { type: 'text', required: true },
    isActivate   : { type: 'boolean'},
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
        this.isActivate = true;
      },
      beforeSave: function() {
        this.updatedAt = new Date();
      }
    },
    methods: {
      serialize: function () {
        return {
          id           : this.id,
          firstName    : this.firstName,
          lastName     : this.lastName,
          username     : this.username,
          password     : this.password,
          isActivate   : this.isActivate,
          accessToken  : this.accessToken,
          refreshToken : this.refreshToken,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow(),
        };
      }
    }
  });
};

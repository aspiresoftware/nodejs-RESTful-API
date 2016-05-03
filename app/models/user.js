/**
 * User model
 */
var moment = require('moment');

module.exports = function (orm, db) {
  var User = db.define('user', {
    firstname    : { type: 'text', required: true },
    lastname     : { type: 'text', required: true },
    username     : { type: 'text', required: true },
    password     : { type: 'text', required: true },
    email        : { type: 'text', required: true },
    dob          : { type: 'date', time: false, required: false },
    location     : { type: 'text', required: false },
    isActivate   : { type: 'boolean'},
    isDeleted    : { type: 'boolean'},
    createdAt    : { type: 'date', time: true },
    updatedAt    : { type: 'date', time: true }
  },
  {
    hooks: {
      beforeCreate: function() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActivate = true;
        this.isDeleted = false;
      },
      beforeSave: function() {
        this.updatedAt = new Date();
      }
    },
    methods: {
      serialize: function () {
        var token;

        if (this.token) {
          token = this.token.map(function (t) { return t.serialize(); });
        } else {
          token = [];
        }

        return {
          id           : this.id,
          firstname    : this.firstname,
          lastname     : this.lastname,
          username     : this.username,
          password     : this.password,
          email        : this.email,
          dob          : this.dob,
          location     : this.location,
          isActivate   : this.isActivate,
          isDeleted    : this.isDeleted,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow(),
          token        : token
        };
      }
    }
  });
  User.hasOne('role',
    db.models.role, { required: true, autoFetch: true});
};

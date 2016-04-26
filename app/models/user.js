/**
 * User model
 */
var moment = require('moment');

module.exports = function (orm, db) {
  var User = db.define('user', {
    firstName    : { type: 'text', required: true },
    lastName     : { type: 'text', required: true },
    isActivate   : { type: 'boolean'},
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
          isActivate   : this.isActivate,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow(),
        };
      }
    }
  });
};

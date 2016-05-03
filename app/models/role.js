/**
 * User model
 */
var moment = require('moment');

module.exports = function (orm, db) {
  var Role = db.define('role', {
    rolename     : { type: 'text', required: true },
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
        return {
          rolename     : this.rolename,
          isActivate   : this.isActivate,
          isDeleted    : this.isDeleted,
          createdAt    : moment(this.createdAt).fromNow(),
          updatedAt    : moment(this.updatedAt).fromNow()
        };
      }
    }
  });
};

var moment = require('moment');

module.exports = function (orm, db) {
  var User = db.define('user', {
    firstName : { type: 'text', required: true },
    lastName  : { type: 'text', required: true },
    username  : { type: 'text', required: true },
    password  : { type: 'text', required: true },
    createdAt : { type: 'date', required: true, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        this.createdAt = new Date();
      }
    },
    methods: {
      serialize: function () {
        return {
          id        : this.id,
          firstName : this.firstName,
          lastName  : this.lastName,
          username  : this.username,
          password  : this.password,
          createdAt : moment(this.createdAt).fromNow()
        };
      }
    }
  });
};

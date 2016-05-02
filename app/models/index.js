/**
 * Register models here
 */
var orm      = require('orm');
var paging = require("orm-paging");
var settings = require('../../config/settings');

var connection = null;

function setup(db, cb) {
  require('./user')(orm, db);
  require('./login')(orm, db);
  require('./role')(orm, db);

  return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm.connect(settings.database, function (err, db) {
    if (err) return cb(err);

    db.settings.set('instance.returnAllErrors', true);
    db.use(paging);
    setup(db, cb);
  });
};

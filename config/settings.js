var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT || 3002,
  database   : {
    protocol : "mysql", // or "postgresql"
    query    : { pool: true },
    host     : "127.0.0.1",
    database : "helpMe",
    user     : "root",
    password : "root"
  }
};

module.exports = settings;

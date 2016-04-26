/**
 * This file automatically creates tables in DB
 * It will take models from model folder and created tables based on models
 */
var models = require('../app/models/');

models(function (err, db) {
  if (err) throw err;

  db.drop(function (err) {
    if (err) throw err;

    db.sync(function (err) {
      if (err) throw err;

      db.close();
      console.log("Done!");
    });
  });
});

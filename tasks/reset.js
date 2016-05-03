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

      db.models.role.create({
        rolename    : 'admin',
        isActivate   : true,
        isDeleted    : false,
        createdAt    : new Date(),
        updatedAt    : new Date()
      }, function (err, message) {
        if (err) throw err;
          db.models.role.create({
            rolename    : 'user',
            isActivate   : true,
            isDeleted    : false,
            createdAt    : new Date(),
            updatedAt    : new Date()
          }, function (err, message) {
            if (err) throw err;

            db.close();
            console.log("Done!");
        });
      });
    });
  });
});
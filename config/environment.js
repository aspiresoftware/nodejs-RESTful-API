var path     = require('path');
var express  = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var settings = require('./settings');
var models   = require('../app/models/');

module.exports = function (app) {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(express.methodOverride());
  app.use(function (req, res, next) {
    models(function (err, db) {
      if (err) return next(err);

      req.models = db.models;
      req.db     = db;

      return next();
    });
  });
  // app.use(app.router);
};

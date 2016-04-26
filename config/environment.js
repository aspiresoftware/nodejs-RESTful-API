/**
 * This file will define Db and models
 */

// Inject node module dependencies
var path     = require('path');
var express  = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var settings = require('./settings');
var models   = require('../app/models/');

module.exports = function (app) {
  // HTTP request logger middleware for node.js
  app.use(logger('dev'));
  // Node.js body parsing middleware (this dows not handle multipart body)
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Set up DB and models
  app.use(function (req, res, next) {
    models(function (err, db) {
      if (err) return next(err);

      req.models = db.models;
      req.db     = db;

      return next();
    });
  });
};

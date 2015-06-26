if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());

var mergeConfigEnvironment = function (obj) {
  if (typeof obj !== 'object') return obj;
  return _.mapValues(obj, function (v) {
    return typeof v === 'string' && v.indexOf('ENV.') === 0 ?
      process.env[v.substr(4)] :
      mergeConfigEnvironment(v);
  });
};

var config = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
config = mergeConfigEnvironment(config);
var db = require('./db/db.js')(config);
var auth = require('./auth.js')(config, app, db);
var router = require('./routes.js')(config, auth, db);

app.use('/', router);

app.listen(process.env.PORT || 3000);

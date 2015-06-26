
module.exports = function(appConfig) {
  var fs = require('fs');
  var path = require('path');
  var Sequelize = require('sequelize');
  var Columns = require('./columns.js');

  var config = appConfig.db;
  var sequelize = config.url ?
    new Sequelize(config.url, config.options) :
    new Sequelize(config.database, config.user, config.password, config.options);

  var db = {};
  var models = ['user', 'user_games', 'game', 'hand'];
  var modelDefs = [];

  models.forEach(function (modelName) {
    var modelDef = require('./models/' + modelName + '.js');
    modelDefs.push(modelDef);
    var modelFriendly = modelName.replace(/_([a-z])/g, function (x) {
      return x.substr(1).toUpperCase();
    }).replace(/^([a-z])/, function (x) { return x.toUpperCase(); });

    var model = modelDef.define(sequelize, Columns);
    db[modelFriendly] = model;
  });

  modelDefs.forEach(function (modelDef) {
    modelDef.associate(db);
  });


  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

var config = require('../../config/config.json')[process.env.NODE_ENV || 'dev'];
var db = require('./db.js')(config);

module.exports = {
  promise: db.sequelize.sync({force: true}),
  db: db
};


module.exports = function (config, auth, db) {
  var express = require('express');
  var router = express.Router();

  router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  router.get('/protected', auth.loginRequired, function (req, res) {
    res.json({status: 'success'});
  });

  var users = require('./controllers/users_controller.js')(auth, db);
  var games = require('./controllers/games_controller.js')(auth, db);
  router.use('/users', users);
  router.use('/games', games);

  return router;
};

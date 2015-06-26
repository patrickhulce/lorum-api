module.exports = function (auth, db) {
  var express = require('express');
  var router = express.Router();

  router.get('/', function (req, res) {
    db.User.findAll().then(function (users) {
      res.json(users);
    });
  });

  router.get('/:userId', function (req, res) {
    db.User.findById(req.params.userId).then(function (user) {
      res.json(user);
    });
  });

  return router;
};

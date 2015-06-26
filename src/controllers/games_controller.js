var _ = require('lodash');

module.exports = function (auth, db) {
  var Games = require('../services/games_service.js')(db);

  var express = require('express');
  var router = express.Router();

  router.route('/').
    get(function (req, res) {
      Games.getAll().then(function (games) {
        res.json(games);
      });
    }).
    post(function (req, res) {
      var game = req.body;
      delete game.id;
      Games.upsert(game).then(function (dbGame) {
        res.json(dbGame);
      });
    });

  router.route('/:gameId').
    get(function (req, res) {
      Games.getById(req.params.gameId).then(function (game) {
        if (!game) res.sendStatus(404);
        else res.json(game);
      });
    }).
    put(function (req, res) {
      var game = req.body;
      game.id = req.params.gameId;
      Games.upsert(game).then(function () {
        res.sendStatus(204);
      });
    });

  router.route('/:gameId/hands').
    post(function (req, res) {
      var scoreObj = req.body;
      scoreObj.gameId = req.params.gameId;
      scoreObj.recorderId = req.user && req.user.id;
      Games.recordScore(scoreObj).then(function () {
        res.sendStatus(204);
      });
    }).
    put(function (req, res) {
      var scoreObj = req.body;
      scoreObj.gameId = req.params.gameId;
      scoreObj.updaterId = req.user && req.user.id;
      Games.updateScore(scoreObj).then(function () {
        res.sendStatus(204);
      });
    });

  return router;
};

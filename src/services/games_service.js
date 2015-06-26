var _ = require('lodash');

module.exports = function (db) {
  var playerInclude = {model: db.User, as: 'Players'};
  var handsInclude = {model: db.Hand};

  var camelizeAll = function (obj) {
    if (!obj || typeof obj !== 'object' || obj.setDate === Date.prototype.setDate) return obj;
    else if (obj.slice === Array.prototype.slice) return obj.map(camelizeAll);

    if (obj.toJSON) obj = obj.toJSON();
    var newObj = {};
    Object.keys(obj).forEach(function (key) {
      newObj[_.camelCase(key)] = camelizeAll(obj[key]);
    });
    return newObj;
  };

  var createHands = function (scoreObj) {
    return Object.keys(scoreObj.scores).map(function (scorerId) {
      return {
        round: scoreObj.round,
        gameType: scoreObj.gameType,
        score: scoreObj.scores[scorerId],
        ScorerId: Number(scorerId),
        UpdaterId: scoreObj.updaterId || scoreObj.recorderId,
        RecorderId: scoreObj.recorderId,
        gameId: scoreObj.gameId
      };
    });
  };

  return {
    getAll: function () {
      return db.Game.findAll({
        include: [playerInclude]
      }).then(function (games) {
        return games.map(camelizeAll);
      });
    },
    getById: function (id) {
      return db.Game.findById(id, {
        include: [playerInclude, handsInclude]
      }).then(camelizeAll);
    },
    /**
     * Updates metadata about a game or creates the game if it doesn't exist.
     *
     * @param gameData
     *
     * {
     *   id
     *   name
     *   players: [
     *     player1_id, player2_id, player3_id, player4_id
     *   ]
     * }
     */
    upsert: function (gameData) {
      var game = db.Game.build({
        id: gameData.id,
        name: gameData.name
      }, {
        isNewRecord: !gameData.id
      });
      var gamePromise = game.save();
      return gamePromise.then(function (game) {
        return [game, db.UserGames.update({
          isActive: false
        }, {
          where: {
            gameId: game.id
          }
        })];
      }).spread(function (game) {
        gameData.playerIds.map(function (playerId, index) {
          return db.UserGames.upsert({
            isActive: true,
            position: index + 1,
            userId: playerId,
            gameId: game.id
          });
        });
        return game;
      });
    },
    /**
     * Records a score for each player in the game.
     *
     * @param scoreObj
     *
     * {
     *   round
     *   gameType
     *   recorderId
     *   gameId
     *   scores: {
     *     player1_id: score,
     *     player2_id: score
     *   }
     * }
     */
    recordScore: function (scoreObj) {
      var hands = createHands(scoreObj);
      console.log(hands);
      return db.Hand.bulkCreate(hands);
    },
    /**
     * Updates a score for each player in the game.
     *
     * @param scoreObj
     *
     * {
     *   round
     *   gameType
     *   updaterId
     *   gameId
     *   scores: {
     *     player1_id: score,
     *     player2_id: score
     *   }
     * }
     */
    updateScore: function (scoreObj) {
      return createHands(scoreObj).map(function (hand) {
        return db.Hand.update({
          score: hand.score,
          UpdaterId: hand.UpdaterId
        }, {
          where: {
            ScorerId: hand.ScorerId,
            gameId: hand.gameId,
            round: hand.round,
            gameType: hand.gameType
          }
        });
      }).reduce(function (x, y) { return x.then(function() { return y; })});
    }
  }
};

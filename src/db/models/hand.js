module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('hand', {
      id: Columns.ID(),
      round: Columns.INTEGER(),
      gameType: Columns.INTEGER(),
      score: Columns.INTEGER()
    });
  },
  associate: function (db) {
    db.Hand.belongsTo(db.Game);
    db.Game.hasMany(db.Hand);
    db.Hand.belongsTo(db.User, {as: 'Scorer'});
    db.Hand.belongsTo(db.User, {as: 'Recorder'});
    db.Hand.belongsTo(db.User, {as: 'Updater'});
  }
};

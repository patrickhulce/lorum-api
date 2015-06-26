module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('user_games', {
      position: Columns.INTEGER(),
      isActive: Columns.BOOLEAN()
    });
  },
  associate: function (db) {
    db.User.belongsToMany(db.Game, { as: 'Games', through: db.UserGames });
    db.Game.belongsToMany(db.User, { as: 'Players', through: db.UserGames });
  }
};

module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('game', {
      id: Columns.ID(),
      name: Columns.STRING(),
      doNotTrack: Columns.BOOLEAN()
    });
  },
  associate: function (db) {
    // db.User.hasMany(db.Project);
  }
};

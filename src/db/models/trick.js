module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('trick', {
      id: Columns.ID(),
      cardPlayed: Columns.INTEGER()
    });
  },
  associate: function (db) {
    db.Trick.belongsTo(db.Hand);
    db.Hand.hasMany(db.Trick);
  }
};

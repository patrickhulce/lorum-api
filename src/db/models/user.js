module.exports = {
  define: function (sequelize, Columns) {
    return sequelize.define('user', {
      id: Columns.ID(),
      firstName: Columns.STRING(),
      lastName: Columns.STRING(),
      email: Columns.STRING(),
      access: Columns.STRING()
    }, {
      getterMethods: {
        fullName: function () {
          return this.firstName + ' ' + this.lastName;
        }
      }
    });
  },
  associate: function (db) {
    // db.User.hasMany(db.Project);
  }
};

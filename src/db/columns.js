var Sequelize = require('sequelize');

module.exports = {
  ID: function () {
    return {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  UUID: function () {
    return {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    };
  },
  STRING: function () {
    return {
      type: Sequelize.STRING
    };
  },
  BOOLEAN: function () {
    return {
      type: Sequelize.BOOLEAN
    };
  },
  INTEGER: function () {
    return {
      type: Sequelize.INTEGER
    }
  },
  DOUBLE: function () {
    return {
      type: Sequelize.DOUBLE
    }
  },
  DATETIME: function () {
    return {
      type: Sequelize.DATE
    };
  }
};
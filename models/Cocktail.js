const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cocktail = sequelize.define('Cocktail', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  instructions: {
    type: DataTypes.TEXT
  }
});

module.exports = Cocktail;

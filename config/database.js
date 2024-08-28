const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('formations', 'postgres', '1234abcD.', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;

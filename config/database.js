const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('formations', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;

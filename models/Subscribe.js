const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Formation = require('./Formation');
const User = require('./User');

const Subscribe = sequelize.define('Subscribe', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    pourcentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    formationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Formation,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'subscribes',
    timestamps: false,
  });

Formation.hasMany(Subscribe, { foreignKey: 'formationId' });
Subscribe.belongsTo(Formation, { foreignKey: 'formationId' });

User.hasMany(Subscribe, { foreignKey: 'userId' });
Subscribe.belongsTo(User, { foreignKey: 'userId' });

module.exports = Subscribe;
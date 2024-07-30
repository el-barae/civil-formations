const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Formation = require('./Formation');

const Video = sequelize.define('Video', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
  }, {
    tableName: 'videos',
    timestamps: false,
  });

Formation.hasMany(Video, { foreignKey: 'formationId' });
Video.belongsTo(Formation, { foreignKey: 'formationId' });

module.exports = Video;
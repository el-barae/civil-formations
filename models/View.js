const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 
const Video = require('./Video'); 

const View = sequelize.define('View', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  view: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  videoId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Video,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'views',
  timestamps: false,
});

User.hasMany(View, { foreignKey: 'userId' });
Video.hasMany(View, { foreignKey: 'videoId' });
View.belongsTo(User, { foreignKey: 'userId' });
View.belongsTo(Video, { foreignKey: 'videoId' });

module.exports = View;

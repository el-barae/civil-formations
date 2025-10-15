const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Video = require('./Video');
const User = require('./User');

const Commentaire = sequelize.define('Commentaire', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'commentaires',
    timestamps: true, 
  });
  
Commentaire.belongsTo(User, { foreignKey: 'userId' });
Commentaire.belongsTo(Video, { foreignKey: 'videoId' });

User.hasMany(Commentaire, { foreignKey: 'userId' });
Video.hasMany(Commentaire, { foreignKey: 'videoId' });

module.exports = Commentaire;

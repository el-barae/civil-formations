const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Formation = require('./Formation');
const User = require('./User');

const Avis = sequelize.define('Avis', {
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
    tableName: 'avis',
    timestamps: true, 
  });
  
Avis.belongsTo(User, { foreignKey: 'userId' });
Avis.belongsTo(Formation, { foreignKey: 'formationId' });

User.hasMany(Avis, { foreignKey: 'userId' });
Formation.hasMany(Avis, { foreignKey: 'formationId' });

module.exports = Avis;

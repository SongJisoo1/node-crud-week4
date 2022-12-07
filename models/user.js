'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comment, {
        foreignKey: 'userId'
      })
      this.hasMany(models.Post, {
        foreignKey: 'userId'
      });
      this.hasMany(models.Like, {
        foreignKey: 'userId',
      });
      this.hasMany(models.Like, {
        foreignKey: 'nickname',
      })
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nickname:{ 
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      password:  {
        type: DataTypes.STRING,
        allowNull: false
    },
  },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      paranoid: true,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};
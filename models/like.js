'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Post, { foreignKey: 'postId'});
      this.belongsTo(models.User, { foreignKey: 'userId'});
      this.belongsTo(models.User, { foreignKey: 'nickname'});
    }
  }
  Like.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Post',
          key: 'postId',
        },
        onDelete: 'cascade'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId'
        }
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
          model: 'User',
          key: 'nickname'
        }
      }
    }, 
    {
      sequelize,
      timestamps: true,
      underscored: false,
      paranoid: false,
      modelName: 'Like',
      tableName: 'likes',
    }
  );
  return Like;
};
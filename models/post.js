'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comment, { foreignKey: 'postId' });
      this.hasMany(models.Like, { foreignKey: 'postId' });
      this.belongsTo(models.User, { foreignKey: 'userId' }); 
    }
  }
  Post.init(
      {
        postId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'userId'
          },
          onDelete: 'cascade'
        },
        nickname: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: 'User',
            key: 'userId'
          }
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        like: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      paranoid: false,
      modelName: 'Post',
      tableName: 'Post',
    }
  );
  return Post;
};
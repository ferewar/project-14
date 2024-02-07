const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  commentText: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, //comment cannot be an empty string
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user', 
      key: 'id',
    },
  },
  postId: { 
    type: DataTypes.INTEGER,
    references: {
      model: 'post', 
      key: 'id',
    },
  },
}, {
  sequelize,
  freezeTableName: true,
  underscored: true,
  modelName: 'comment',
});

module.exports = Comment;

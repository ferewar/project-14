const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init({
  // ID column
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  // Username column
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Email column
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // Password column
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8], // Passwords must be at least 8 characters long
    },
  },
}, {
  hooks: {
    beforeCreate: async (userData) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      return userData;
    },
    beforeUpdate: async (userData) => {
      if (userData.changed('password')) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      return userData;
    },
  },
  sequelize,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  modelName: 'user',
});

module.exports = User;

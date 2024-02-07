// Add some initial data for testing
const sequelize = require('../config/connection');
const { User, Post } = require('../models');
const bcrypt = require('bcrypt');

const userData = [
  {
    username: 'johnDoe',
    email: 'johndoe@example.com',
    password: bcrypt.hashSync('password123', 10) 
  },
  {
    username: 'janeSmith',
    email: 'janesmith@example.com',
    password: bcrypt.hashSync('password123', 10)
  },
];

const postData = [
  {
    title: 'Why MVC is so important',
    content: 'MVC allows developers to maintain a true separation of concerns, devising their code between the Model layer for data, the View layer for design, and the Controller layer for application logic.',
    userId: 1 
  },
  {
    title: 'Authentication vs. Authorization',
    content: 'There is a difference between authentication and authorization. Authentication means confirming your own identity, whereas authorization means being allowed access to the system.',
    userId: 2 
  },
];

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userData, { individualHooks: true });
  await Post.bulkCreate(postData);
  
  process.exit(0);
};

seedDatabase();

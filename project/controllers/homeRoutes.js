const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Route to serve the home page with all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('home', { 
      posts, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    console.error('Error while fetching posts:', err);
    res.status(500).json(err);
  }
});

// Route to serve the dashboard page, requires authentication
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userPosts = await Post.findAll({
      where: {
        userId: req.session.userId
      },
      include: [
        {
          model: Comment,
          attributes: ['id', 'commentText', 'postId', 'userId', 'createdAt'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
      ],
    });

    const posts = userPosts.map((post) => post.get({ plain: true }));

    res.render('dashboard', { 
      posts,
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to serve the login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
});

// Route to serve the signup page
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
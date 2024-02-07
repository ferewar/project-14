const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const withAuth = require('../../utils/auth');
const saltRounds = 10;

// Create a new user
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    
    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.json({ user: newUser, message: 'Account created successfully!' });
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const customErrors = err.errors.map((e) => {
        if (e.validatorKey === 'isEmail') {
          return 'Please enter a valid email address.';
        }
        if (e.validatorKey === 'len' && e.path === 'password') {
          return 'Password must be at least 8 characters long.';
        }
        return e.message;
      });
      return res.status(400).json({ errors: customErrors });
    }
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User login
router.post('/login', async (req, res) => {
  console.log('Login attempt with:', req.body);
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });
    console.log('User data:', userData);

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again.' });
    }
    console.log('Attempting password comparison for user:', userData.username);

    // Comparing the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(req.body.password, userData.password);
    console.log('Password valid?', validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password, please try again.' });
    }

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User logout
router.post('/logout', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;

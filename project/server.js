require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const userRoutes = require('./controllers/api/userRoutes'); 
// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up session with Sequelize store
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Set up Handlebars with custom helpers
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    extend: function (name, context) {
    },
  }
});

// Register hbs with the Express app
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Apply session middleware
app.use(session(sess));

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Apply routes
app.use(routes);
app.use('/api/users', userRoutes);
// Sync and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

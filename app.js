// === Importing Modules
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

// === Define variables
const app = express();
const PORT = process.env.PORT || config.get('port') || 5000;
const MONGODB_URI = process.env.MONGODB_URI || config.get('mongoUri');

// === Configuration
app.use(express.json({ extended: true }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// === Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/users.routes'));

// === Deploy
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// === ConnectDB && start server
async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Database connection successful');
  } catch (e) {
    console.log('Database connection error', e.message);
    process.exit(1);
  }

  app.listen(PORT, () =>
    console.log('Server was started at http://localhost:' + PORT)
  );
}

start();

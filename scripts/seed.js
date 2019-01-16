// script to create tables in database

require('dotenv').config();

const db = require('../db');

db.sync({ force: true })
  .then(() => {
    console.log('Done syncing tables!');
    db.close();
  });

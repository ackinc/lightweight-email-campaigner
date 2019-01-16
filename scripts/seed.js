// script to create tables in database

require('dotenv').config();

const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URL);

const modelsDir = path.join(__dirname, '../models');
sequelize.import(path.join(modelsDir, 'campaign'));
sequelize.import(path.join(modelsDir, 'campaignlead'));
sequelize.import(path.join(modelsDir, 'lead'));
sequelize.import(path.join(modelsDir, 'user'));

sequelize.sync({ force: true })
  .then(() => {
    console.log('Done syncing tables!');
    sequelize.close();
  });

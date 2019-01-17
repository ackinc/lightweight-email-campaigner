const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URL);

sequelize.authenticate()
  .then(() => console.log('Connected to database')) // eslint-disable-line no-console
  .catch((err) => {
    console.error('Failed to connect to database'); // eslint-disable-line no-console
    throw err;
  });

const modelsDir = path.join(__dirname, '../models');
const models = {};
models.Campaign = sequelize.import(path.join(modelsDir, 'campaign'));
models.CampaignLead = sequelize.import(path.join(modelsDir, 'campaignlead'));
models.Lead = sequelize.import(path.join(modelsDir, 'lead'));
models.User = sequelize.import(path.join(modelsDir, 'user'));

sequelize.models = models;

module.exports = sequelize;

const path = require("path");
const Sequelize = require("sequelize");

const { DATABASE_URL } = process.env;
const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: { ssl: { rejectUnauthorized: false } },
});

sequelize
  .authenticate()
  .then(() => console.log(`Connected to database ${DATABASE_URL}`)) // eslint-disable-line no-console
  .catch((err) => {
    console.error("Failed to connect to database"); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  });

const modelsDir = path.join(__dirname, "../models");
const models = {};
models.Campaign = sequelize.import(path.join(modelsDir, "campaign"));
models.CampaignLead = sequelize.import(path.join(modelsDir, "campaignlead"));
models.Lead = sequelize.import(path.join(modelsDir, "lead"));
models.User = sequelize.import(path.join(modelsDir, "user"));

sequelize.models = models;

module.exports = sequelize;

// script to create tables in database

require("dotenv").config();

const db = require("../common/db");

db.sync({ force: true }).then(() => {
  console.log("Done syncing tables!"); // eslint-disable-line no-console
  db.close();
});

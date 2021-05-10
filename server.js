require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");

const userRouter = require("./routes/user");
const campaignRouter = require("./routes/campaign");
const trackerRouter = require("./routes/tracker");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./views/index.html"))
);

app.use("/users", userRouter);
app.use("/campaigns", campaignRouter);
app.use("/tracker", trackerRouter);

app.use(errorHandler);

const { PORT } = process.env;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

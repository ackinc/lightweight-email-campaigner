require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const authRouter = require('./routes/auth');
const campaignRouter = require('./routes/campaign');
const trackerRouter = require('./routes/tracker');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './views/index.html')));

app.use('/auth', authRouter);
app.use('/campaigns', campaignRouter);
app.use('/tracker', trackerRouter);

const { PORT } = process.env;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

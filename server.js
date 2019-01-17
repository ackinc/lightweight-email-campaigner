require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const authRouter = require('./routes/auth');
const campaignRouter = require('./routes/campaign');
const trackerRouter = require('./routes/tracker');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/auth', authRouter);
app.use('/campaigns', campaignRouter);
app.use('/tracker', trackerRouter);

const { PORT } = process.env;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const authRouter = require('./routes/auth');
const trackerRouter = require('./routes/tracker');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/auth', authRouter);
app.use('/tracker', trackerRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))

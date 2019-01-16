require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))

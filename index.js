const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv= require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
const port = 4000;


app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use('/posts', require('./routes/PostRoutes'));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
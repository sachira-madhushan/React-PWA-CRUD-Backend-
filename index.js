const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;


app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pwa'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});


app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use('/posts', require('./routes/PostRoutes'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
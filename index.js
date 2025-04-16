const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv= require('dotenv');
const postRoutes    = require('./routes/PostRoutes');
const authRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');

dotenv.config();

const app = express();
app.use(cors());
const port = 4000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})







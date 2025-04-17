const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const postRoutes = require('./routes/PostRoutes');
const authRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const subscriptionRoutes = require('./routes/SubscriptionRoutes');
const db = require('./config/db');
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
app.use('/api/v1/subscription', subscriptionRoutes);

cron.schedule("* * * * *", () => {
    console.log('⏱️ Running cron job to update remaining time');

    const sql = `
    UPDATE subscriptions 
    SET remaining_minutes = remaining_minutes-1
    WHERE remaining_minutes>0`;

    const expireSubscriptionsSQL = `
    UPDATE subscriptions AS s
    JOIN users AS u ON s.user_id = u.id
    SET 
      s.status = 0,
      u.status = 0
    WHERE s.remaining_minutes <= 0 AND s.status != 0
  `;


    db.query(sql, [], (err, result) => {

    })
    
    db.query(expireSubscriptionsSQL, [], (err, result) => {

    })

})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})







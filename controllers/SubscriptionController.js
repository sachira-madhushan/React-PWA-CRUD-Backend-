const db = require('../config/db');
const moment = require('moment-timezone');

const createSubscription = (req, res) => {
    const { userId, packageId } = req.body;



    db.query("SELECT * FROM packages WHERE id = ?", [packageId], (err, results) => {

        const startDate = moment.tz("Asia/Colombo");

        
        const endDate = startDate.clone().add(results[0].days, 'day');


        const now = moment.tz("Asia/Colombo");


        const diffInMinutes = endDate.diff(now, 'minutes');
        const formattedStart = startDate.format('YYYY-MM-DD HH:mm:ss');
        const formattedEnd = endDate.format('YYYY-MM-DD HH:mm:ss');
        
        db.query("INSERT INTO subscriptions (user_id, package_id, start_date, end_date,remaining_minutes) VALUES (?, ?, ?,?,?)", [userId, packageId, formattedStart, formattedEnd, diffInMinutes], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ "message": "Package activated" });
        });
    });


};

module.exports = {
    createSubscription
}
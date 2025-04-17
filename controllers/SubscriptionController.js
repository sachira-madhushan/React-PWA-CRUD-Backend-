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

const getAllSubscriptions = (req, res) => {
    const sql = `
    SELECT 
      subscriptions.*, 
      users.name AS user_name, 
      users.email AS user_email, 
      packages.name AS package_name
    FROM subscriptions
    JOIN users ON subscriptions.user_id = users.id
    JOIN packages ON subscriptions.package_id = packages.id
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const formatted = results.map(item => ({
            ...item,
            start_date: moment(item.start_date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss"),
            end_date: moment(item.end_date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss")
        }));

        res.json(formatted);

    });

}

const getAllPackages=(req,res)=>{
    db.query("SELECT * FROM packages", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

module.exports = {
    createSubscription,
    getAllSubscriptions,
    getAllPackages
}
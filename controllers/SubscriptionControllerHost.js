const db = require('../config/db');
const moment = require('moment-timezone');

const createSubscription = async (req, res) => {
    const { userId, packageId,accountType } = req.body;

    try {
        // Fetch the package data
        const [results] = await db.query("SELECT * FROM packages WHERE id = ?", [packageId]);

        const startDate = moment.tz("Asia/Colombo");
        const endDate = startDate.clone().add(results[0].days, 'day');
        const now = moment.tz("Asia/Colombo");
        const diffInMinutes = endDate.diff(now, 'minutes');
        const formattedStart = startDate.format('YYYY-MM-DD HH:mm:ss');
        const formattedEnd = endDate.format('YYYY-MM-DD HH:mm:ss');

        // Deactivate current active subscription
        await db.query("UPDATE subscriptions SET status = 0, remaining_minutes = 0 WHERE user_id = ? AND status = 1", [userId]);

        // Insert new subscription
        await db.query("INSERT INTO subscriptions (user_id, package_id, start_date, end_date, remaining_minutes,package_type) VALUES (?, ?, ?, ?, ?,?)", [userId, packageId, formattedStart, formattedEnd, diffInMinutes,accountType]);

        // Update user status to active
        await db.query("UPDATE users SET status = 1 WHERE id = ?", [userId]);

        res.json({ "message": "Package activated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getAllSubscriptions = async (req, res) => {
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

    try {
        const [results] = await db.query(sql);

        const formatted = results.map(item => ({
            ...item,
            start_date: moment(item.start_date).format("YYYY-MM-DD HH:mm:ss"),
            end_date: moment(item.end_date).format("YYYY-MM-DD HH:mm:ss")
        }));

        res.json(formatted);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getAllPackages = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM packages");
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createSubscription,
    getAllSubscriptions,
    getAllPackages
};

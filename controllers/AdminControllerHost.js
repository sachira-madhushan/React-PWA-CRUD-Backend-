const db = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, name, email, status, created_at FROM users');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const changeUserStatus = async (req, res) => {
    const { userId, isActive } = req.body;

    try {
        const [result] = await db.query('UPDATE users SET status = ? WHERE id = ?', [isActive, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
};

const addSubscription = async (req, res) => {
    const { userId, subscriptionType, startDate, endDate } = req.body;

    try {
        const [userResults] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await db.query(
            'INSERT INTO subscriptions (user_id, subscription_type, start_date, end_date) VALUES (?, ?, ?, ?)',
            [userId, subscriptionType, startDate, endDate]
        );

        res.status(201).json({ message: 'Subscription added successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add subscription' });
    }
};

module.exports = {
    getAllUsers,
    changeUserStatus,
    addSubscription
};

const db  = require('../config/db');


const getAllUsers=async(req, res) =>{
    db.query('SELECT id, name, email, status, created_at FROM users', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.status(200).json(results);
    });
}

const changeUserStatus=async(req, res) =>{
    const { userId, isActive } = req.body;
    db.query('UPDATE users SET status = ? WHERE id = ?', [isActive, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update user status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User status updated successfully' });
    });
}

const addSubscription=async(req, res) =>{
    const { userId, subscriptionType, startDate, endDate } = req.body;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.query(
            'INSERT INTO subscriptions (user_id, subscription_type, start_date, end_date) VALUES (?, ?, ?, ?)',
            [userId, subscriptionType, startDate, endDate],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to add subscription' });
                }

                res.status(201).json({ message: 'Subscription added successfully' });
            }
        );
    });
}


module.exports = {
    getAllUsers,
    changeUserStatus,
    addSubscription
};

const pool = require('../config/db'); // mysql2 promise pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        const [subscriptions] = await pool.query(
            "SELECT * FROM subscriptions WHERE user_id = ? AND status = 1",
            [user.id]
        );

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        if (subscriptions.length > 0) {
            return res.json({
                user: userWithoutPassword,
                token,
                expire_date: moment(subscriptions[0].end_date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss"),
                last_sync: moment.tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss")
            });
        } else {
            return res.json({ user: userWithoutPassword, token });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "User already exists or database error" });
    }
};

const profile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const [results] = await pool.query(
            'SELECT id, name, email FROM users WHERE id = ?',
            [userId]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token or server error' });
    }
};

module.exports = {
    login,
    register,
    profile
};

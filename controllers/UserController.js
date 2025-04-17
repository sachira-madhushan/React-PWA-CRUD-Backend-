const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment=require('moment-timezone')
const login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            db.query("SELECT * FROM subscriptions WHERE user_id =? AND status=1", [user.id], (err, results2) => {
                
                if(results2.length>0){
                    res.json({ user: userWithoutPassword, token: token,expire_date:moment(results2[0].end_date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss") });
                }else{
                    res.json({ user: userWithoutPassword});
                }
            })
            
            
        });
    });
};

const register = (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: "User already exists" });

            res.status(201).json({ id: result.insertId, name, email });
        });
    });
};


const profile = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        const userId = decoded.id;

        db.query('SELECT id, name, email FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json(results[0]);
        });
    });
};

module.exports = {
    login,
    register,
    profile
};

const db = require('../config/db');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

// Test DB connection
(async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ MySQL connection established successfully.');
    } catch (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
    }
})();

const createPost = async (req, res) => {
    const { title, body } = req.body;
    try {
        const [result] = await db.query("INSERT INTO posts (title, body, user_id) VALUES (?, ?, ?)", [title, body, req.user.id]);
        res.json({ id: result.insertId, title, body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM posts WHERE user_id = ?", [req.user.id]);
        const [userStatus] = await db.query("SELECT status FROM users WHERE id = ?", [req.user.id]);

        if (userStatus[0]?.status == 0) {
            return res.status(403).json({ error: "User is inactive" });
        }

        res.json({
            posts: results,
            last_sync: moment.tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss")
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [id, req.user.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const syncPosts = async (req, res) => {
    const { posts, email } = req.body;

    try {
        const [users] = await db.query(
            "SELECT id, name, email, status FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const userId = users[0].id;

        if (!users[0].status) return res.status(403).json({ message: 'User is inactive' });

        for (const post of posts) {
            const { id, sync_status, ...postData } = post;

            if (sync_status === 'deleted') {
                await db.query(
                    "DELETE FROM posts WHERE id = ? AND user_id = ?",
                    [id, userId]
                );
            } else {
                const [existing] = await db.query(
                    "SELECT * FROM posts WHERE id = ? AND user_id = ?",
                    [id, userId]
                );

                if (existing.length > 0) {
                    await db.query(
                        "UPDATE posts SET ? WHERE id = ? AND user_id = ?",
                        [postData, id, userId]
                    );
                } else {
                    await db.query(
                        "INSERT INTO posts SET ?, id = ?, user_id = ?",
                        [postData, id, userId]
                    );
                }
            }
        }

        const [results] = await db.query("SELECT * FROM posts WHERE user_id = ?", [userId]);

        res.status(200).json({
            message: 'Sync complete',
            posts: results,
            last_sync: moment.tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss")
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    syncPosts,
};

const db = require('../config/db');

const createPost = (req, res) => {
    const { title, body } = req.body;

    db.query("INSERT INTO posts (title, body, user_id) VALUES (?, ?, ?)", [title, body, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, title, body });
    });
};

const getAllPosts = (req, res) => {
    db.query("SELECT * FROM posts WHERE user_id = ?", [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const deletePost = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    });
};

const syncPosts = (req, res) => {
    const postsToSync = req.body.posts;

    const processPost = (index) => {
        if (index >= postsToSync.length) {
            db.query("SELECT * FROM posts WHERE user_id = ?", [req.user.id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).send({ message: 'Sync complete', posts: results });
            });
            return;
        }

        const post = postsToSync[index];
        const { id, syncStatus, ...postData } = post;

        if (syncStatus === 'deleted') {
            db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [id, req.user.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                processPost(index + 1);
            });
        } else {
            db.query("SELECT * FROM posts WHERE id = ? AND user_id = ?", [id, req.user.id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                if (results.length > 0) {
                    db.query("UPDATE posts SET ? WHERE id = ? AND user_id = ?", [postData, id, req.user.id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        processPost(index + 1);
                    });
                } else {
                    db.query("INSERT INTO posts SET ?, user_id = ?", [postData, req.user.id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        processPost(index + 1);
                    });
                }
            });
        }
    };

    processPost(0);
};

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    syncPosts,
};

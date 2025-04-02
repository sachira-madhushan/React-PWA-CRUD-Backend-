const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pwa'
});

const createPost = async (req, res) => {
    const { title, body } = req.body;
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [title, body], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, title, body });
    });
};

const getAllPosts = async (req, res) => {
    db.query("SELECT * FROM posts", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const deletePost = async (req, res) => {
    
    db.query("DELETE FROM posts WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    });
};

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
};

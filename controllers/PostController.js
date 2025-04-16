const db = require('../config/db');

// (async () => {
//     try {
//         await db.query('SELECT 1');
//         console.log('✅ MySQL connection established successfully.');
//     } catch (err) {
//         console.error('❌ Error connecting to MySQL:', err.message);
//     }
// })();

const createPost = async (req, res) => {
    const { title, body } = req.body;
    try {
        const [result] = await db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [title, body]);
        res.json({ id: result.insertId, title, body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM posts");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const syncPosts = async (req, res) => {
    const postsToSync = req.body.posts;
    try {
        for (const post of postsToSync) {
            const { id, syncStatus, ...postData } = post;

            if (syncStatus === 'deleted') {
                await db.query('DELETE FROM posts WHERE id = ?', [id]);
            } else {
                const [existing] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);

                if (existing.length > 0) {
                    await db.query('UPDATE posts SET ? WHERE id = ?', [postData, id]);
                } else {
                    await db.query('INSERT INTO posts SET ?', postData);
                }
            }
        }
        const [results] = await db.query("SELECT * FROM posts");
        res.status(200).send({ message: 'Sync complete', posts: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    syncPosts
};

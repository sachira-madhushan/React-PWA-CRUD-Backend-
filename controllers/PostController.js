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

const syncPosts=async(req,res)=>{
    const postsToSync=req.body;

    postsToSync.forEach(post => {
        const { id, syncStatus, ...postData } = post;

        if (syncStatus === 'deleted') {
          db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
            if (err) {
              console.error('Error deleting post:', err);
            }
          });
        } else {

          db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
            if (err) {
              console.error('Error checking post:', err);
            }
    
            if (results.length > 0) {
              db.query('UPDATE posts SET ? WHERE id = ?', [postData,id], (err, result) => {
                if (err) {
                  console.error('Error updating post:', err);
                }
              });
            } else {
              db.query('INSERT INTO posts SET ?', postData, (err, result) => {
                if (err) {
                  console.error('Error inserting post:', err);
                }
              });
            }
          });
        }
      });
    
      res.status(200).send({ message: 'Sync complete' });
}

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    syncPosts
};

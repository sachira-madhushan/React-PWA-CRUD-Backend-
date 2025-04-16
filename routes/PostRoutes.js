const express = require('express');
const { getAllPosts, createPost, deletePost,syncPosts } = require('../controllers/PostController');
const authMiddleware    = require('../middleware/auth');
const router = express.Router();


router.get('/',authMiddleware, getAllPosts);

router.delete('/:id',authMiddleware, deletePost);

router.post('/',authMiddleware, createPost);

router.post('/sync',authMiddleware, syncPosts);

module.exports = router;
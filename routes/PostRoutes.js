const express = require('express');
const { getAllPosts, createPost, deletePost,syncPosts } = require('../controllers/PostControllerHost');
const authMiddleware    = require('../middleware/auth');
const router = express.Router();


router.get('/',authMiddleware, getAllPosts);

router.delete('/:id',authMiddleware, deletePost);

router.post('/',authMiddleware, createPost);

router.post('/sync', syncPosts);

module.exports = router;
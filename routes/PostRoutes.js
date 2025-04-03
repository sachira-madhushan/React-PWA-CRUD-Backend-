const express = require('express');
const { getAllPosts, createPost, deletePost,syncPosts } = require('../controllers/PostController');

const router = express.Router();


router.get('/', getAllPosts);

router.delete('/:id', deletePost);

router.post('/', createPost);

router.post('/sync', syncPosts);

module.exports = router;
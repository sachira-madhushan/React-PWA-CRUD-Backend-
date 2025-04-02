const express = require('express');
const { getAllPosts, createPost, deletePost } = require('../controllers/PostController');

const router = express.Router();


router.get('/', getAllPosts);

router.delete('/:id', deletePost);

router.post('/', createPost);

module.exports = router;
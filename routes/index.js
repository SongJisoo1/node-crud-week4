const express = require('express');
const router = express.Router();

const postRouter = require('./post.js');
const likeRouter = require('./like.js');
const commentRouter = require('./comment.js');
const signupRouter = require('./signup.js');
const { router: loginRouter } = require('./login.js');

router.use('/posts', [likeRouter, postRouter]);
router.use('/comments', [commentRouter]);
router.use('/signup', [signupRouter]);
router.use('/login', [loginRouter]);

module.exports = router;
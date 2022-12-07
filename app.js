require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index.js');
const postRouter = require('./routes/post.js');
const commentRouter = require('./routes/comment.js');
const signupRouter = require('./routes/signup.js');
const { router: loginRouter } = require('./routes/login.js');

const app = express();

app.set('port', process.env.PORT || 3000);


app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);


app.listen(app.get('port'), () => {
    console.log('서버 연결 성공');
});

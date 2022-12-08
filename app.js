require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

app.set('port', process.env.PORT || 3000);


app.use(express.json());
app.use(cookieParser());

app.use('/', routes);


app.listen(app.get('port'), () => {
    console.log('서버 연결 성공');
});

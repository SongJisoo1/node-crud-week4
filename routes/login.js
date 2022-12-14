require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const isLogin = require('../middleware/isLogin');
const { User } = require('../models');

const SECRET_KEY = process.env.SECRET_KEY;

// 로그인
const tokenObject = {};

router.post('/', isLogin, async (req, res) => {
    const { nickname, password } = req.body;

    try {

        const user = await User.findOne({where: {nickname}});

        const hashed = await bcrypt.hash(password, 10);

        const validatePw = await bcrypt.compare(password, hashed);

        if(!user || !validatePw) {
            res.status(412).json({'errorMessage': '닉네임 또는 패스워드를 확인해주세요'});
            return;
        }
        
        const accessToken = jwt.sign(
            { id: user.nickname },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            {},
            SECRET_KEY,
            { expiresIn: '1d'}
        );

        tokenObject[refreshToken] = nickname;

        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.status(200).json({'message': accessToken});
    
    } catch(err) {
        return res.status(400).json({'errorMessage': '로그인에 실패하였습니다.'});
    }
    
});

module.exports = { router, tokenObject };

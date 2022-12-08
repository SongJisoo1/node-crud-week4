const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User } = require('../models');

router.post('/' , async (req, res) => {
    const { nickname, password, confirm } = req.body;

    try {
        const validNick = /^[A-Za-z0-9]{3,30}$/;
        const validPassword = /^[A-Za-z0-9@!]{4,}$/;
        const includeNick = new RegExp(nickname, 'g');

        // 아이디 유효성 검사
        if(!validNick.test(nickname)) {
            res.status(412).json({'message': 'ID 형식이 일치하지 않습니다.'});
            return;
        }

        // 비밀번호 유효성 검사 
        if(!validPassword.test(password)) {
            res.status(412).json({'message': '패스워드 형식이 일치하지 않습니다.'});
            return;
        }

        // confirm과 password가 일치하는지 검사
        if(password !== confirm) {
            res.status(412).json({'message': '패스워드가 일치하지 않습니다.'});
            return;
        }

        // 비밀번호에 닉네임이 포함되었는지 검사
        if(includeNick.test(password)) {
            console.log(password.search(nickname));
            res.status(412).json({'message': '패스워드에 닉네임이 포함되어 있습니다.'});
            return;
        }

        const hashed = await bcrypt.hash(password, 10);

        const [ _, isRegister ] = await User.findOrCreate({
            where: { nickname, 'password': hashed },
            default: { 'nickname': nickname, 'password': hashed }
        });

        if(!isRegister) {
            return res.status(412).json({'message': '중복된 닉네입입니다.'});
        } 

        res.status(201).json({'message': '회원 가입에 성공하였습니다.'});
    } catch(err) {
        return res.status(400).json({'errorMessage': '요청한 데이터 형식이 올바르지 않습니다.'});
    }    
})


module.exports = router;
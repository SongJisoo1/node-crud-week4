require('dotenv').config();
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { tokenObject } = require('../routes/login.js');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {

    console.log(tokenObject);

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken || !refreshToken) {
        res.status(412).json({'errorMessage': '로그인 후 이용해주세요'});
        return;
    }

    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = validateRefreshToken(refreshToken);

    console.log(isAccessTokenValidate);
    console.log(isRefreshTokenValidate);

    if(!isRefreshTokenValidate) {
        delete tokenObject[refreshToken];
        res.status(412).json({'errorMessage': '로그인 후 이용해주세요'});
        return;
    }

    if(!isAccessTokenValidate) {
        const accessTokenId = tokenObject[refreshToken];
        if(!accessTokenId) {
            res.status(412).json({'errorMessage': '로그인 후 이용해주세요'});
            return;
        }

        const newAccessToken = createAccessToken(accessTokenId);

        res.cookie('accessToken', newAccessToken, { httpOnly: true });
        res.status(200).json({'message': 'accessToken이 재발급 되었습니다.'});
        return;
    }

    
    const nickname = getAccessTokenPayload(accessToken);
    console.log(nickname);
    const user = await User.findOne({
      attributes: ['userId', 'nickname'],
      where: { nickname },
      raw: true,
    });
    res.locals.user = user;
    next();
}

function createAccessToken(id) {
    const accessToken = jwt.sign(
      { id: id }, 
      SECRET_KEY, 
      { expiresIn: '10s' }) 
  
    return accessToken;
}
  


  function validateAccessToken(accessToken) {
    console.log(accessToken);
    try {
      jwt.verify(accessToken, SECRET_KEY); 
      return true;
    } catch (error) {
      return false;
    }
  }
  
  
  function validateRefreshToken(refreshToken) {
    console.log(refreshToken);
    try {
      jwt.verify(refreshToken, SECRET_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  
  function getAccessTokenPayload(accessToken) {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY); 
    } catch (error) {
      return null;
    }
  }   


    



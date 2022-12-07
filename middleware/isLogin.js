const jwt = require('jsonwebtoken');

const  tokenObject  = require('../routes/login.js');

const SECRET_KEY = 'EXPRESS_JSON_WEB_TOKEN_KEY_!@#$';

module.exports = (req, res, next) => {

    console.log(tokenObject);

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken || !refreshToken) {
        console.log('11111111111111111111111111111111111111111');
        next();
    }

    console.log('dddddddddddddddddddddddddddddddddddddddd');

    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = validateRefreshToken(refreshToken);

    console.log(isAccessTokenValidate);
    console.log(isRefreshTokenValidate);

    if(isRefreshTokenValidate) {
        console.log('여기냐????????????')
        const accessTokenId = tokenObject[refreshToken];
        const newAccessToken = createAccessToken(accessTokenId);
        tokenObject[refreshToken] = accessTokenId;
        res.cookie('accessToken', newAccessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        res.status(200).json({'message': accessToken});
        return;
    }

    if(isAccessTokenValidate) {
        res.status(412).json({'errorMessage': '로그인 상태입니다.'});
        return;
    //     const accessTokenId = tokenObject[refreshToken];
    //     console.log(accessTokenId);
    //     if(!accessTokenId) {
    //       console.log('2222222222222222222');
    //         res.status(412).json({'errorMessage': '로그인 후 이용해주세요'});
    //         return;
    //     }

    //     const newAccessToken = createAccessToken(accessTokenId);

    //     res.cookie('accessToken', newAccessToken, { httpOnly: true });
    //     res.status(200).json({'message': 'accessToken이 재발급 되었습니다.'});
    //     return;
    }

    next();
    
    // const nickname = getAccessTokenPayload(accessToken);
    // console.log(nickname);
    // const user = await User.findOne({
    //   attributes: ['userId', 'nickname'],
    //   where: { nickname },
    //   raw: true,
    // });
    // res.locals.user = user;
    // next();
}

function createAccessToken(id) {
    const accessToken = jwt.sign(
      { id: id }, // JWT 데이터
      SECRET_KEY, // 비밀키
      { expiresIn: '10s' }) // Access Token이 10초 뒤에 만료되도록 설정합니다.
  
    return accessToken;
}
  

  // Access Token을 검증합니다.
  function validateAccessToken(accessToken) {
    console.log(accessToken);
    try {
      jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Refresh Token을 검증합니다.
  function validateRefreshToken(refreshToken) {
    console.log(refreshToken);
    try {
      jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Access Token의 Payload를 가져옵니다.
  function getAccessTokenPayload(accessToken) {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
      return payload.id;
    } catch (error) {
      return null;
    }
  }   


    



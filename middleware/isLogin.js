require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   
    try {
        const accessToken = validateAccessToken(req.cookies.accessToken);
        console.log(accessToken);

        if(accessToken) {
            return res.status(403).json({'errorMessage': '이미 로그인되어 있습니다.'});
        }

        next();

    } catch(err) {
        return res.status(400).send({ 'errorMessage' : '잘못된 접근입니다.'});
    }
}

function validateAccessToken(accessToken) {
    console.log(accessToken);
    try {
      jwt.verify(accessToken, process.env.SECRET_KEY); 
      return true;
    } catch (error) {
      return false;
    }
}


    



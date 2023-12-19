const LocalStrategy = require('passport-local');
const userSchema = require('../../../schema/userSchema');
const HmacConvert = require('../../commons/passwordConvert');
const jwt = require('jsonwebtoken');

// LocalStrategy 설정 객체
const config = {
  usernameField: 'email',  // 'email' 필드 사용하도록 설정
  passwordField: 'password'  // 'password' 필드 사용하도록 설정
};

// LocalStrategy 생성
const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    // 패스워드를 암호화 한다
    password = HmacConvert(password)
    // 사용자 스키마에서 이메일과 암호화된 패스워드로 사용자 조회
    const data = await userSchema.find({"email":email,"password" : password })
    if (data.length === 1) {
      // Access Token 및 Refresh Token을 생성하여 반환한다
      const accessToken = jwt.sign(
        {email:email},
         process.env.SHA_KEY,
         {expiresIn: "1d"}) // 1일 후에 만료되는 access 토큰
        const refreshToken  = jwt.sign(
          {},
          process.env.SHA_KEY,
          {expiresIn: "14d"}, // 14일 후에 만료되는 refresh 토큰
        );
        // 성공적으로 찾았으므로 done 함수 호출하여 반환한다
        done(null, {accessToken : accessToken , refreshToken : refreshToken})
    } else if(data.length === 0){
      // 사용자가 없거나 비밀번호가 틀린 경우
      done(null,false , {message:"이메일이나 비밀번호가 틀렸습니다."})
    } else {
      // 여러개의 사용자가 조회되었거나 알 수 없는 문제가 발생한 경우
      done(null,false , {message:"알수 없는 문제가 있습니다."})
    }
  } catch (err) {
    // 에러가 발생한 경우
    done(err, null);
  }
});

module.exports = local;
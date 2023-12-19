const LocalStrategy = require('passport-local');
const adminSchema = require('../../../schema/adminSchema');
const HmacConvert = require('../../commons/passwordConvert');
const jwt = require('jsonwebtoken');

// LocalStrategy 설정 객체
const config = {
  usernameField: 'email',// 'email' 필드 사용하도록 설정
  passwordField: 'password',// 'password' 필드 사용하도록 설정
};

/**
 * LocalStrategy를 생성하는 함수
 * @param {string} email - 입력된 이메일
 * @param {string} password - 입력된 비밀번호
 * @param {function} done - 콜백 함수
 */
const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    // 비밀번호를 변환하여 암호화한다
    password = HmacConvert(password)
     // 입력된 이메일과 암호화된 비밀번호로 관리자를 찾는다
    const data = await adminSchema.find({"email":email,"password" : password })
    // 관리자 데이터를 찾은 경우
    if (data.length === 1) {
      // Access Token 및 Refresh Token을 생성하여 반환한다
      const accessToken = jwt.sign(
        {email:email},
         process.env.ADMIN_KEY,
         {expiresIn: "1d"}) // 1일 후에 만료되는 access 토큰
        const refreshToken  = jwt.sign(
          {},
          process.env.ADMIN_KEY,
          {expiresIn: "14d"}, // 14일 후에 만료되는 refresh 토큰
        )

      // 성공적으로 찾았으므로 done 함수 호출하여 반환한다
        done(null, {accessToken : accessToken , refreshToken : refreshToken})
    }
    // 관리자 데이터를 찾지 못한 경우
    else if(data.length === 0){
      // 에러 없이 실패 응답을 반환한다 (이메일이나 비밀번호가 틀렸음)
      done(null,false , {message:"이메일이나 비밀번호가 틀렸습니다."})
    }
    // 다수의 관리자 데이터를 찾은 경우 (오류 상황)
    else {
      // 에러 없이 실패 응답을 반환한다 (알 수 없는 문제)
      done(null,false , {message:"알수 없는 문제가 있습니다."})
    }
  } catch (err) {
    // 에러가 발생한 경우
    done(err, null);
  }
});

module.exports = local;
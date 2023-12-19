const adminSchema = require('../../schema/adminSchema');
const HmacConvert = require('../commons/passwordConvert');

/**
 * 관리자 생성 함수
 * @param {object} jsonValue - 생성할 관리자의 JSON 데이터
 * @returns {Array} - [생성 여부(boolean), 메시지 객체(object)]
 */
async function adminCreate(jsonValue) {
  try {
    // 패스워드를 Hmac SHA256 방식으로 암호화한다
    jsonValue.password = HmacConvert(jsonValue.password);

    // 유저 데이터를 생성하여 저장한다
    const data = await adminSchema(jsonValue).save();

    return{message: "가입이 정상적으로 이루어졌습니다."};
    
  } catch (error) {
    // 에러가 발생한 경우 false 반환
    console.log(error);
    
  }
}

module.exports = { adminCreate };
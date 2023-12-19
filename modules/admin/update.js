const adminSchema = require('../../schema/adminSchema');
const HmacConvert = require('../commons/passwordConvert');

/**
 * 관리자 정보를 수정하는 함수
 * @param {string} adminId - 수정할 관리자의 ID
 * @param {object} jsonValue - 수정할 관리자의 JSON 데이터
 * @returns {Array} - [수정 여부(boolean), 메시지 객체(object)]
 */
// 업데이트 하면 안되는 필드는 여기에 배열로 입력
const noUpdateKey = ['email']
async function adminEdit(adminId, jsonValue) {
  try {
    // 업데이트 하면 안되는 필드를 제거
    noUpdateKey.map((data)=>{
      if(jsonValue.hasOwnProperty(data)){
        delete jsonValue[data]
      }
    })
    // 패스워드를 Hmac SHA256 방식으로 암호화한다
    jsonValue.password = HmacConvert(jsonValue.password);

    // 관리자 데이터를 업데이트하고 수정된 항목 수를 가져온다
    const data = await adminSchema.updateOne({ "_id": adminId }, jsonValue);

   // 수정된 항목이 1개인 경우 수정 성공으로 간주하고 true 반환
   if (data.modifiedCount === 1) {
    return [true,{message: "수정이 정상적으로 이루어졌습니다."}];
  } else {
    // 수정된 항목이 없는 경우 수정 실패로 간주하고 false 반환
    return [false,{message:"수정항목이 없습니다."}]
  }
} catch (error) {
  // 에러가 발생한 경우 false 반환
  console.log(error);
  if (error.code == 11000)
  {
    return [false,{message:"이미 가입된 이메일 주소 입니다."}]
  }
  else {
    return [false,{message:"알 수 없는 오류 입니다.(b)"}]
  }
}
}

module.exports = { adminEdit };
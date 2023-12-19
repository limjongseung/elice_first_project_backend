const adminSchema = require('../../schema/adminSchema');

/**
 * 관리자 정보를 DB에서 삭제하는 함수
 * @param {string} id - 삭제할 관리자의 ID
 * @returns {Array} - [삭제 여부(boolean), 메시지 객체(object)]
 */
async function adminDelete(id) {
  try {
    // 주어진 ID에 해당하는 관리자 정보를 삭제한다
    const data = await adminSchema.findByIdAndRemove(id);

   // 삭제된 데이터가 없는 경우 false 반환
   if (data === null) {
    return [false,{message: "회원 정보가 없습니다."}];
  } else {
    // 삭제가 성공적으로 이루어진 경우 true 반환
    return [true,{message: "삭제가 정상적으로 이루어졌습니다."}];
  }
} catch (error) {
  // 에러가 발생한 경우 false 반환
  console.log(error);
  
}
}

module.exports = { adminDelete };
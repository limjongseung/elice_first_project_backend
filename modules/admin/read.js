const userSchema = require('../../schema/userSchema');

/**
 * 유저 정보를 조회하는 함수
 * @param {string} keyType - 조회할 유저 정보의 키 타입 (예: "email")
 * @param {string} keyValue - 조회할 유저 정보의 키 값
 */
async function userInfo(keyType, keyValue) {
  const filter = {};
  filter[keyType] = keyValue;
  // 유저 정보를 조회하고 반환한다
  return await userSchema.find(filter);
}

async function userList() {
  // 모든 유저 정보를 조회하고 반환한다
  return await userSchema.find({});
}

module.exports = { userInfo, userList };
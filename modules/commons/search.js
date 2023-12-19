const userSchema = require('../../schema/userSchema');
const adminSchema = require('../../schema/adminSchema');

/**
 * 유저 정보를 조회하는 함수
 * @param {string} keyType - 조회할 유저 정보의 키 타입 (예: "email")
 * @param {string} keyValue - 조회할 유저 정보의 키 값
 */
async function UserSearch(keyType, keyValue) {
  const filter = {};
  filter[keyType] = keyValue;
  const userData = {};
  // 데이터베이스에서 유저 정보를 조회하고 JSON 형태로 반환
  const data = await userSchema.find(filter).lean();
  data.map(({ ...data }) => {
    userData.id = data._id.toString();
    userData.email = data.email;
    userData.name = data.name;
    userData.nickname = data.nickname;
    userData.address = data.address;
    userData.zipcode = data.zipcode;
    userData.mobile = data.mobile;
    userData.phone = data.phone;
  });
  return userData;
}

/**
 * 관리자 정보를 조회하는 함수
 * @param {string} keyType - 조회할 관리자 정보의 키 타입 (예: "email")
 * @param {string} keyValue - 조회할 관리자 정보의 키 값
 */
async function AdminSearch(keyType, keyValue) {
  const filter = {};
  filter[keyType] = keyValue;
  const userData = {};
  const data = await adminSchema.find(filter).lean();
  data.map(({ ...data }) => {
    userData.id = data._id.toString();
    userData.email = data.email;
    userData.name = data.name;
    userData.mobile = data.mobile;
    userData.phone = data.phone;
  });
  return userData;
}

module.exports = { UserSearch, AdminSearch };
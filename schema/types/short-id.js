const { nanoid } = require('nanoid');

/**
 * shortId 스키마 정의
 */
const shortId = {
  type: String,
  default: () => {
    // nanoid를 사용하여 랜덤한 문자열을 생성하고 기본값으로 반환
    return nanoid();
  },
  required: true,
  index: true  // 인덱스 설정
};

module.exports = shortId;

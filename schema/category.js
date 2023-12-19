const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

/**
 * 카테고리 스키마 정의
 */
const CategorySchema = new Schema({
  shortId: shortId,  // shortId 스키마 사용
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true,  // 생성 및 수정 시간을 자동 기록
  collection: "categories"  // 컬렉션 이름 지정
});

module.exports = CategorySchema;

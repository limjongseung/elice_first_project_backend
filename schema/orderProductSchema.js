/**
 * orderProductSchema: 주문 상품 정보 스키마 정의
 * productschema에 order_id와 user_email을 추가한다. 
 * shortId의 키 중복 시 문제가 발생하므로 user_email은 추가 확인용 키로 사용
 */
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const orderProductSchema = new mongoose.Schema({
    order_id: {
      type:String,
      required: true,
    },
    user_email: {
      type:String,
      required: true,
    }, 
    name: {
      type:String,
      required: true,
    },
    product_id: {
      type:String,
      required: true,
    },
    price: {
      type:Number,
      required: true,
    },
    company: {
      type:String,
      required: true,
    },
    description: {
      type:String,
    },
    img: {
      type:String,
    },
    quantity: {
      type:Number,
      required: true,
    },
    category: {
      type:String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: "orderProduct"
  });

  module.exports =mongoose.model('orderProduct', orderProductSchema);
const mongoose = require('mongoose');

// 정의된 스키마에 따라 주문 정보를 담는 스키마
const OrderSchema =  new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  user_email:{
    type:String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  shipping_status: {
    type: String,
    enum: ["배송준비중", "배송중", "배송완료"],
    required: true,
    default: "배송준비중",
  }
  
}, {versionKey: false, timestamps: true, collection: "orderList" });

module.exports =  mongoose.model('orderList',OrderSchema);

const orderSchema = require('../../schema/orderListSchema');
const productSchema = require('../../schema/productSchema');
const orderProductSchema = require('../../schema/orderProductSchema');
const mongoose = require('mongoose');
const categorySchema = require('../../schema/category');
const Category = mongoose.model('Category', categorySchema); 

/**
 * 주문을 생성하고 주문 정보를 데이터베이스에 저장하는 함수
 * @param {object} userData - 주문을 생성하는 유저의 정보
 * @param {object} orderData - 주문에 관련된 데이터
 * @returns {Promise<[boolean, {message: string}]>} - 성공 여부 및 메시지를 담은 배열
 */
async function OrderCreate(userData,orderData){
  const [orderId, userEmail] = await OrderInfo(userData);
  const isComplete = await OrderProducts(orderId,userEmail, orderData);

  if (isComplete){
    return [true,{message: "성공적으로 주문정보가 저장되었습니다."}];
  }
  else
  {
    return [false,{message:"주문 정보 저장에 실패했습니다."}];
  }
}

/**
 * 주문 정보를 생성하고 데이터베이스에 저장하는 함수
 * @param {object} userData - 주문 생성에 사용되는 유저 정보
 * @returns {Promise<[string, string]>} - 주문 ID와 유저 이메일을 담은 배열
 */
async function OrderInfo(userData) {
  try {
    let order = {};
    order.user_id = userData.id;
    order.user_email = userData.email;
    order.name = userData.name;
    order.phone = userData.phone;
    order.address = userData.address;
    order.shipping_status = "배송준비중";
    order.total_price = 0;
    const data = await orderSchema(order).save();
    return [data._id.toString(),data.user_email];
  } catch (error) {
    console.log(error);
  }
};

/**
 * 주문에 포함된 상품 정보를 데이터베이스에 저장하는 함수
 * @param {string} orderId - 주문 ID
 * @param {string} userEmail - 주문을 생성한 유저의 이메일
 * @param {object} orderData - 주문에 관련된 데이터
 * @returns {Promise<boolean>} - 성공 여부
 */
async function OrderProducts(orderId,userEmail,orderData) {
  //short id 변경 여부 확인 필요
  try {
    const promise =  orderData.orderedProducts.map(async (product) => {
      const filter = {};
      filter.shortId = product.productId;
      const [{...data}] = await productSchema.find(filter).lean();
      // console.log(data)
      // if (data.length == 0){
      //   throw new Error("상품이 없습니다.")
      // } 
      // else{
        const p = {};
        p.order_id = orderId;
        p.user_email = userEmail;
        p.product_id = data._id.toString();
        p.category = await GetCategory(data.category.toString());
        p.company= data.company;
        p.description = data.description;
        p.img = data.img;
        p.name = data.name;
        p.price = data.price;
        p.shortId = data.shortId;
        p.quantity = product.quantity;
        orderProductSchema(p).save();
      // }

    })
    await Promise.all(promise)
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

/**
 * 카테고리 정보를 조회하는 함수
 * @param {string} id - 카테고리 ID
 * @returns {Promise<string>} - 카테고리 이름
 */
async function GetCategory(id){
  try {
    const [{...data}] =  await Category.find({"_id" : id}, {name:1}).lean()
    return data.name;
  } catch (error) {
    console.log(error);
    return "미지정 카테고리";
  }
}

module.exports = OrderCreate;

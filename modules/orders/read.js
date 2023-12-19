const search = require('../commons/search');
const orderListSchema = require('../../schema/orderListSchema');
const orderProductSchema = require('../../schema/orderProductSchema');
const mongoose = require('mongoose');
const categorySchema = require('../../schema/category');
const Category = mongoose.model('Category', categorySchema); 

/**
 * 특정 유저의 주문 목록을 조회하는 함수
 * @param {string} keyType - 조회할 유저 정보의 키 타입 (예: "email")
 * @param {string} keyValue - 조회할 유저 정보의 키 값
 * @returns {Promise<[boolean, object[]]>} - 성공 여부 및 주문 목록을 담은 배열
 */
async function OrderRead(keyType, keyValue) {
  try {
    let orderList = [];
    const userData = await search.UserSearch(keyType,keyValue);
    const orderData = await orderListSchema.find({"user_id" : userData.id}).lean();

    const getProductPromises =  orderData.map(async (order) => {
      let orderInfo = {}
      orderInfo = {...order};
      orderInfo._id = order._id.toString();
      orderInfo.products = await GetProducts(order._id.toString());
      return orderInfo;
    });
    const processedOrders = await Promise.all(getProductPromises);
    orderList.push(processedOrders);
    return [true,...orderList];
  } catch {(error) => {
    console.log(error);
    return [false,{message:"주문정보를 읽는데 실패했습니다."}];
  }}  
}

/**
 * 특정 주문 ID에 해당하는 주문 정보를 조회하는 함수
 * @param {string} orderId - 조회할 주문의 ID
 * @returns {Promise<[boolean, object[]]>} - 성공 여부 및 주문 정보를 담은 배열
 */
async function OrderSelectRead(orderId) {
 try {
    const orderData = await orderListSchema.find({_id:orderId}).lean();
    const getProductPromises =  orderData.map(async (order) => {
      orderInfo = {...order};
      orderInfo._id = order._id.toString();
      orderInfo.products = await GetProducts(order._id.toString());
      return orderInfo;
    })
    const processedOrders = await Promise.all(getProductPromises);
    return [true, processedOrders];
 } catch {(error) => {
  console.log(error);
  return [false,{message:"주문정보를 읽는데 실패했습니다."}];
 }}
}

/**
 * 특정 주문에 속한 상품 정보를 조회하는 함수
 * @param {string} id - 주문 ID
 * @returns {Promise<object[]>} - 주문에 속한 상품 정보 배열
 */
async function GetProducts(id){
  try {
    let products = []
    const orderProducts =  await orderProductSchema.find({"order_id" : id}).lean();
    orderProducts.map(async (product) => {
      product._id = product._id.toString();
      products.push(product);
    })
    return products

  } catch (error) {
    console.log(error);
    return [false,{message:"데이터가 없습니다."}];
  }
}

module.exports = { OrderRead, OrderSelectRead };
const orderSchema = require('../../schema/orderListSchema');
const orderProductSchema = require('../../schema/orderProductSchema');

/**
 * 주문을 삭제하는 함수
 * @param {string} id - 삭제할 주문의 ID
 * @param {string} email - 주문을 생성한 유저의 이메일
 * @returns {Promise<[boolean, {message: string}]>} - 성공 여부 및 메시지를 담은 배열
 */
async function orderDelete(id,email) {
  try {
    // order id 가 본인의 것인지 확인 한다.
    // email 과 order id 를 확인하여 본인의 오더가 아닐 경우 삭제하지 않는다.
    const order = await orderSchema.findOneAndDelete({_id : id,user_email: email});

    if (order === null) {
    return [false,{message: "주문 정보가 없습니다."}];
  } else {
    // 주문에 속한 상품 정보를 삭제
    orderProductSchema.deleteMany({ order_id : order._id.toString() });
    return [true,{message: "주문 삭제가 정상적으로 이루어졌습니다."}];
  }
} catch (error) {
  // 에러가 발생한 경우 false 반환
  console.log(error);
  return [false,{message: "알 수 없는 오류 입니다.(a)"}];
}
}

module.exports = orderDelete;
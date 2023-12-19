const orderSchema = require('../../schema/orderListSchema');
const orderProductSchema = require('../../schema/orderProductSchema');
const noUpdateKey = ['user_id','user_email','name'];

async function orderUpdate(orderId, jsonValue) {
  try {
    // 업데이트 하면 안되는 필드를 제거
    noUpdateKey.map((data)=>{
      if(jsonValue.hasOwnProperty(data)){
        delete jsonValue[data]
      }
    })
    const data = await orderSchema.updateOne({ "_id": orderId }, jsonValue);

    // 수정된 항목이 1개인 경우 수정 성공으로 간주하고 true 반환
    if (data.modifiedCount === 1) {
      return [true,{message: "수정이 정상적으로 이루어졌습니다."}];
    } else {
      // 수정된 항목이 없는 경우 수정 실패로 간주하고 false 반환
      return [false,{message:"수정항목이 없습니다."}]
    }
  } catch (error) {
    // 에러가 발생한 경우 false 반환
    console.log(error);
    if (error.code == 11000)
    {
      return [false,{message:"이미 가입된 이메일 주소 입니다."}]
    }
    else {
      return [false,{message:"알 수 없는 오류 입니다.(b)"}]
    }
  }
}

async function orderProductQuantityUpdate(orderId,productId,quantity){
  try{
    const data = await orderProductSchema.updateOne({"_id" : productId , "order_id": orderId},{"quantity": quantity})
     // 수정된 항목이 1개인 경우 수정 성공으로 간주하고 true 반환
     if (data.modifiedCount === 1) {
      return [true,{message: "수정이 정상적으로 이루어졌습니다."}];
    } else {
      // 수정된 항목이 없는 경우 수정 실패로 간주하고 false 반환
      return [false,{message:"수정항목이 없습니다."}]
    }
  }catch(error){
     // 에러가 발생한 경우 false 반환
     console.log(error);
     if (error.code == 11000)
     {
       return [false,{message:"이미 가입된 이메일 주소 입니다."}]
     }
     else {
       return [false,{message:"알 수 없는 오류 입니다.(b)"}]
     }
  }
}
module.exports = { orderUpdate, orderProductQuantityUpdate };
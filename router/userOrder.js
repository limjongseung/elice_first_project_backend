const express = require("express");
const orderCreate = require("../modules/orders/create");
const {OrderRead ,OrderSelectRead} = require('../modules/orders/read');
const {orderUpdate,orderProductQuantityUpdate }= require('../modules/orders/update');
const orderDelete = require('../modules/orders/delete');
const search = require('../modules/commons/search');
const router = express.Router();
const passport = require("passport");
const { orderCreateValidation, orderUpdateValidation,orderProductUpdateVaildation } = require("./userOrder-Validation");

/**
 * 주문 전체 조회 API
 * GET /api/orders
 */
router.get('/', passport.authenticate('jwt-user', { session: false }),async (req, res) => {
  const [bool,data] = await OrderRead("email",req.user.email);
  if (bool) {
    res.status(200).json(data);
  } else {
    res.status(400).json({data});
  }
});

/**
 * 주문 생성 API
 * POST /api/orders
 */
router.post("/",passport.authenticate('jwt-user',{ session: false } ), orderCreateValidation, async (req, res) => {
  const data = await search.UserSearch("email",req.user.email);
  const [bool,{message}]= await orderCreate(data,req.body);
  if (bool) {
    res.status(200).json({message}); // 주문 생성 성공
   } else {
    res.status(400).json({message}); // 주문 생성 실패
   }   
});

/**
 * 주문 상세 조회 API
 * GET /api/orders/:orderId
 */
router.get("/:orderId", passport.authenticate('jwt-user',{ session: false } ), async (req, res) => {
  const [bool, message] =  await OrderSelectRead(req.params.orderId);
  if (bool) {
    res.status(200).json(...message); // 주문 상세 조회 성공
   } else {
    res.status(400).json(message); // 주문 상세 조회 실패
   }
});

/**
 * 주문 수정 API
 * PUT /api/orders/:orderId
 */
router.put("/:orderId", passport.authenticate('jwt-user',{ session: false } ), orderUpdateValidation, async (req, res) => {
  const [bool,message] = await orderUpdate(req.params.orderId,req.body)
  if (bool) {
    res.status(200).json(message); // 배송 정보 수정 완료
   } else {
    res.status(400).json(message); // 배송 정보 수정 실패
   }
});

router.put("/:orderId/:orderProductId",passport.authenticate('jwt-user',{ session: false } ),orderProductUpdateVaildation, async(req, res)=>{
  const [bool,message] = await orderProductQuantityUpdate(req.params.orderId,req.params.orderProductId,req.body.quantity)
  if (bool) {
    res.status(200).json(message); // 배송 정보 수정 완료
   } else {
    res.status(400).json(message); // 배송 정보 수정 실패
   }
})
/**
 * 주문 삭제 API 
 * 오더 아이디를 클라이언트에서 보내면
 * 세션 체크후 및 본인의 오더인지 확인 후 해당 오더를 지운다.
 */

router.delete("/:orderId",passport.authenticate('jwt-user', { session: false }), async (req, res) => {
 const [bool,{message}] = await orderDelete(req.params.orderId,req.user.email)
 if (bool) {
  res.status(200).json({message}); // 주문 삭제 성공
 } else {
  res.status(400).json({message}); // 주문 삭제 실패
 }   
});

module.exports = router;
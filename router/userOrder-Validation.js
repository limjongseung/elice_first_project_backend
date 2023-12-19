const Joi = require('joi');

// 주문 생성 시 데이터 유효성 검사 미들웨어
const orderCreateValidation = (req, res, next) => {
  // Joi를 사용하여 데이터 유효성 검사를 위한 스키마 정의
  const schema = Joi.object({
    orderedProducts: Joi.array().items(
      Joi.object({
        productId: Joi.string(),
        quantity: Joi.number()
      })
    )
  });
        // 요청 데이터를 정의한 스키마로 검증
        const { error } = schema.validate(req.body);

        // 유효성 검사 에러가 있을 경우 400 Bad Request 응답
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // 유효성 검사 통과 시 다음 미들웨어로 진행
        next();
    };

// 주문 수정 시 데이터 유효성 검사 미들웨어
const orderUpdateValidation = (req, res, next) => {
  // Joi를 사용하여 데이터 유효성 검사를 위한 스키마 정의
  const schema = Joi.object({
      phone: Joi.string(),
      address: Joi.string(),
      shipping_status: Joi.string()
        .valid("배송준비중", "배송중", "배송완료")
  });

        // 요청 데이터를 정의한 스키마로 검증
        const { error } = schema.validate(req.body);

        // 유효성 검사 에러가 있을 경우 400 Bad Request 응답
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // 유효성 검사 통과 시 다음 미들웨어로 진행
        next();
    };    

const orderProductUpdateVaildation = (req,res,next) =>{
  const schema = Joi.object({
    quantity: Joi.number()
  })
  
        // 요청 데이터를 정의한 스키마로 검증
        const { error } = schema.validate(req.body);

        // 유효성 검사 에러가 있을 경우 400 Bad Request 응답
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // 유효성 검사 통과 시 다음 미들웨어로 진행
        next();
}
module.exports = { orderCreateValidation, orderUpdateValidation,orderProductUpdateVaildation };
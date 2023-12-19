const Joi = require('joi');

// 관리자 생성 유효성 검사 미들웨어
const adminCreateValidation = (req, res, next) => {
    // Joi를 사용하여 데이터 유효성 검사를 위한 스키마 정의
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(), // 이메일 형식, 필수 입력
        name: Joi.string()
            .max(11)  // 최대 11자까지 허용
            .required(), // 이름, 필수 입력
        nickname: Joi.string(), // 닉네임
        password: Joi.string(), // 비밀번호
        mobile: Joi.string(), // 휴대폰 번호
        phone: Joi.string(), // 전화번호
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

// 관리자 수정 유효성 검사 미들웨어
const adminUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .max(11)  // 최대 11자까지 허용
            .required(), // 이름, 필수 입력
        nickname: Joi.string(), // 닉네임
        password: Joi.string(), // 비밀번호
        address: Joi.string(), // 주소
        zipcode: Joi.number(), // 우편번호
        mobile: Joi.string(), // 휴대폰 번호
        phone: Joi.string() // 전화번호
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

    module.exports = { adminCreateValidation, adminUpdateValidation };
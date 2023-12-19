// Express 서버 설정
const express = require("express");
const cors = require('cors');
const app = express();

// Swagger UI 설정
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./swagger/swagger.js');

// 라우터 설정
const accountRouter = require('./router/account.js');          // 계정 라우터
const adminRouter = require('./router/admin.js');               // 관리자 라우터
const userOrderRouter = require('./router/userOrder.js');      // 주문 라우터
const conn = require('./connect/connect.js');                  // 몽고디비 연결 설정
const passport = require("passport");                          // Passport 모듈
const passportConfig = require('./modules/passport/index.js');  // Passport 설정
const productRouter = require('./router/product.js');          // 상품 라우터
const categoryRouter = require('./router/category.js');        // 카테고리 라우터


const routeHandler = require('./modules/errorHandler/routeHandler.js')
/**
 * Cross-Origin Resource Sharing (CORS) 설정
 * 다른 도메인에서의 요청을 허용하기 위해 CORS 설정을 적용
 */
app.use(cors());


/**
 * JSON 파싱 설정
 * 요청의 본문을 JSON 형식으로 파싱하여 사용할 수 있도록 함
 */
app.use(express.json());

/**
 * dotenv 설정
 * 환경변수 로드를 위해 dotenv 설정을 적용
 */
require('dotenv').config();

/**
 * Passport 초기화
 * Passport 초기화를 수행하여 사용자 인증을 설정함
 */
app.use(passport.initialize());
/**
 * Passport 설정
 * 사용자 로그인 및 인증 전략을 설정
 */
passportConfig();

/**
 * 라우터 설정
 * 각 경로에 해당하는 라우터를 설정함
 */
app.use('/account', accountRouter);         // 사용자 계정 관리 라우터
app.use('/admin', adminRouter);             // 관리자 계정 관리 라우터
app.use('/orderadmin', userOrderRouter);    // 관리자 주문 관리 라우터
app.use('/orderuser', userOrderRouter);     // 사용자 주문 정보 관리 라우터
app.use('/category', categoryRouter);       // 카테고리 관리 라우터
app.use('/product', productRouter);         // 상품 관리 라우터

/**
 * Swagger 사용 설정
 * /api-docs 경로에 Swagger UI를 설정하여 API 문서를 표시함
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(routeHandler)
/**
 * MongoDB 연결
 * MongoDB와 연결함
 */
conn.MongoConnect();

/**
 * 웹 서버 시작
 * 3000번 포트에서 웹 서버를 시작함
 */
app.get('/', (req, res) => {
  res.send('<html><head></head><body><h1>Hello from Node.js!</h1></body></html>');
});
app.listen(3000, () => {
  console.log("웹 서버가 포트 3000에서 운영중입니다.");
});

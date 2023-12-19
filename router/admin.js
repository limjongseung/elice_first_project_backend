const express = require("express");
const accountCreate = require("../modules/admin/create");
const accountView = require('../modules/admin/read');
const accountDelete = require('../modules/admin/delete');
const accountEdit = require('../modules/admin/update');
const search = require('../modules/commons/search')
const passport = require("passport");
const router = express.Router();
const { adminCreateValidation, adminUpdateValidation } = require('./admin-Validation');

// 로그인한 관리자의 정보를 반환하는 라우터
router.get('/', passport.authenticate('jwt-admin', { session: false }), async (req, res,next) => {
  try {
    // 로그인한 관리자의 이메일을 사용하여 관리자 정보를 조회한다
    const data = await search.AdminSearch("email", req.user.email);
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    next({ code: 500 })
  }
});

/**
 * 관리자 회원 가입
 * POST 방식을 사용하여 관리자 회원 가입 처리
 * @param {object} req.body - 회원 가입에 필요한 정보
 * @returns {object} - 회원 가입 결과 반환 (성공 시 200 응답, 실패 시 400 응답)
 */
router.post('/', adminCreateValidation, async (req, res, next) => {
  try {
  const message = await accountCreate.adminCreate(req.body);
  // 추후에 회원 가입시에 가입후 정보를 달라고 할 경우 고쳐야 할 필요성 있음
   res.status(200).json(message); // Successful registration
  } catch(error) {
    console.log(error)
    next({ code: 500 })
  }

});

/**
 * 회원 탈퇴
 * DELETE 방식을 사용하여 회원 탈퇴 처리
 * @param {string} req.params.id - 회원 ID
 * @returns {object} - 회원 탈퇴 결과 반환 (성공 시 200 응답, 실패 시 400 응답)
 */

router.delete('/', passport.authenticate('jwt-admin',{ session: false } ), async (req, res, next) => {
  try {
    const data = await search.AdminSearch("email",req.user.email)
    const [bool,{message}] =  await accountDelete.adminDelete(data.id)
    if (bool) {
      res.status(200).json({message}); // Successful registration
      } else {
       res.status(400).json({message}); // Registration failed
      }   
  } catch(error) {
    console.log(error)
    next({ code: 500 })
  }
  
})

/**
 * 회원 정보 수정
 * PUT 방식을 사용하여 회원 정보 수정 처리
 * @param {string} req.params.id - 회원 ID
 * @param {object} req.body - 수정할 회원 정보
 * @returns {object} - 회원 정보 수정 결과 반환 (성공 시 200 응답, 실패 시 400 응답)
 */

router.put('/',passport.authenticate('jwt-admin',{ session: false } ), adminUpdateValidation, async (req, res, next) => {
  try {
  const data = await search.AdminSearch("email",req.user.email)
  const [bool,{message}] = await accountEdit.adminEdit(data.id, req.body)

  if (bool) {
    res.status(200).json({message}); // Successful registration
    } else {
     res.status(400).json({message}); // Registration failed
    } 
  } catch(error) {
    console.log(error)
    next({ code: 500 })
  }

});
/**
 * 로그인 라우터
 * POST 방식을 사용하여 로그인 처리
 * @param {string} req.body.email - 사용자 이메일
 * @param {string} req.body.password - 사용자 비밀번호
 * @returns {object} - 로그인 성공 시 200 응답과 액세스 토큰, 실패 시 401 응답
 */
router.post('/login',passport.authenticate('local-admin',{ session: false } ), async(req, res, next) => {
  try {
  res.status(200).json(req.user); // Successful login response
  } catch(error) {
    console.log(error)
    next({ code: 500 })
  }
});

/**
 * 전체 유저 리스트 API 
 * GET 방식을 사용하여 전체 유저 리스트를 가져옴
 * @returns {object} - 전체 유저 리스트 반환 (성공 시 200 응답, 실패 시 메시지 반환)
 */
router.get('/userlist',passport.authenticate('jwt-admin',{ session: false } ), async (req, res, next) => {
  try {
  if (Object.keys(req.query).length !== 0) {
    const data = await accountView.userInfo('_id',req.query.name);
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(400).json({"message" : "데이터 없음"});
    }
  } else {
    res.status(200).json(await accountView.userList());
  }
  } catch(error) {
  console.log(error)
  next({ code: 500 })
}

});

module.exports = router;
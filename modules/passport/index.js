/**
 * Passport 설정
 * passport: Passport 인증 모듈
 * local: 로컬 전략
 * jwt: JWT 전략
 * @param {function} done - Passport 설정 함수
 */
const passport = require('passport');
const localUser = require('./strategies/local-user');
const localAdmin = require('./strategies/local-admin')
const jwtUser = require('./strategies/jwt-user');
const jwtAdmin = require('./strategies/jwt-admin');

// Passport 설정 함수
module.exports = () => {
    // 'local-user' 전략 등록
    passport.use('local-user', localUser);
    // 'local-admin' 전략 등록
    passport.use('local-admin',localAdmin);
    // 'jwt' 전략 등록 
    passport.use('jwt-user', jwtUser);
    passport.use('jwt-admin', jwtAdmin)
};


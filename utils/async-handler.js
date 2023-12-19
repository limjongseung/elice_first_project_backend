class ValidationError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * 비동기 에러 처리 미들웨어 함수.
 * @param {function} requestHandler - 요청 핸들러 함수.
 * @returns {function} Express 미들웨어 함수.
 */
const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(err.status).json({ errorMessage: err.message });
      }
      else{
        res.status(500).json({ errorMessage: err.message });
      }
    }
  }
}

module.exports = {ValidationError, asyncHandler};
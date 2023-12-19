const { Router } = require('express');
const {ValidationError, asyncHandler} = require('../utils/async-handler');
const router = Router();
const path = require("path");
const passport = require("passport");

/* import image related features */
const uploadImg = require('../modules/products/uploadImage');
const removeImg = require('../modules/products/removeImage');
const resizeImg = require('../modules/products/resizeImage');

/* in DB models */
const ProductSchema = require('../schema/product');  
const CategorySchema = require('../schema/category')

const mongoose = require('mongoose');
const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

/* joi schema  load*/
const {getProductSchema, postProductSchema, deleteProductSchema} =  require('./productValidation');

async function findProductId(shortId){
  return Product.findOne({shortId});
}

// 전체 상품 조회
router.get('/', asyncHandler(async (req, res) => {
  const {categoryShortId} = req.query;
  
  // 유효성체크
  await getProductSchema.validateAsync({shortId:categoryShortId});

  // 결과반환
  const category = await Category.findOne({shortId:categoryShortId});
  let data;
  if (category){
    data = await Product.find({category}).populate('category');
  }
  else{
    data = await Product.find({}).populate('category');
  }
  res.json(data);
}));

// 한 상품 조회
router.get('/:productShortId', asyncHandler(async(req, res, next)=>{
  const {productShortId:shortId} = req.params;
  // 유효성 체크
  await getProductSchema.validateAsync({shortId});
  const product = await findProductId(shortId);
  if (!product){
    throw new ValidationError(404,"존재하지 않는 상품 shortId입니다");
  }

  // 결과 반환
  res.json(product);

}));

// 상품 등록
router.post('/', passport.authenticate('jwt-admin', { session: false }), uploadImg.fields([{name : 'thumbnail', maxCount: 1}, {name : 'img', maxCount: 1}]), asyncHandler(async (req, res, next) => {
  const {name, price, company, description, categoryShortId} = req.body;

  // 유효성체크
  await postProductSchema.validateAsync({name, price, company, description, categoryShortId});
  if (JSON.stringify(req.files) !== '{}'){
    if (!req.files['thumbnail']) throw new ValidationError(400,  'thumbnail이 존재하지 않습니다.'); 
    if (!req.files['img']) throw new ValidationError(400,  'img가 존재하지 않습니다.'); 
  }
  const category = await Category.findOne({shortId:categoryShortId});
  if (!category){
    throw new ValidationError(404,  '존재하지 않는 카테고리 shortId입니다');
  }
  
  //결과반환
  const product = await Product.create({name, price, company, description, category, thumbnail:req.files['thumbnail'][0].filename, img:req.files['img'][0].filename});
  res.json(product);

  // 파일 압축
  resizeImg(path.join(__dirname, `../product_imgs/${req.files['img'][0].filename}`)); 

}));

// 상품 수정
router.post('/:productShortId', passport.authenticate('jwt-admin', { session: false }),  uploadImg.fields([{name : 'thumbnail', maxCount: 1}, {name : 'img', maxCount: 1}]), asyncHandler(async(req, res, next)=>{
  const {productShortId:shortId} = req.params;
  const {name, price, company, description, categoryShortId} = req.body;

  // 유효성 체크
  const isExistId = await findProductId(shortId);
  if (!isExistId){
    throw new ValidationError(404,  '존재하지 않는 상품 shortId입니다');
  }
  await postProductSchema.validateAsync({name, price, company, description, categoryShortId})

  const category = await Category.findOne({shortId:categoryShortId});
  if (!category){
    throw new ValidationError(404,  '존재하지 않는 카테고리 shortId입니다');
  }


  /* 해당 상품 수정 */
  // 이미지 수정이 필요한 경우, 이미지 수정 및 이전 이미지 파일 제거
  if (JSON.stringify(req.files) !== '{}'){
    req.files['thumbnail'] && await Product.updateOne({shortId}, {thumbnail:req.files['thumbnail'][0].filename}) && removeImg(path.join(__dirname, `../product_imgs/${isExistId['thumbnail']}`));
    req.files['img']  && await Product.updateOne({shortId}, {img:req.files['img'][0].filename}) && removeImg(path.join(__dirname, `../product_imgs/${isExistId['img']}`));
  }
  await Product.updateOne({shortId}, {name, price, company, description, category});
  res.send("ok");

  // 파일 압축
  if (JSON.stringify(req.files) !== '{}' && req.files['img']){
    resizeImg(path.join(__dirname, `../product_imgs/${req.files['img'][0].filename}`)); 
  }

}));

// 상품 삭제
router.delete("/:productShortId", passport.authenticate('jwt-admin', { session: false }), asyncHandler(async(req, res, next)=>{
  const {productShortId:shortId} = req.params;

  // 유효성체크
  const [value, isExistId] = await Promise.all([deleteProductSchema.validateAsync({shortId}), await findProductId(shortId)]);
  if (!isExistId){
    throw new ValidationError(404,  '존재하지 않는 상품 shortId입니다');
  }

  // 기존 파일 삭제
  removeImg(path.join(__dirname, `../product_imgs/${isExistId['thumbnail']}`));
  removeImg(path.join(__dirname, `../product_imgs/${isExistId['img']}`)); 

  // 해당 상품 삭제
  await Product.deleteOne({shortId});
  res.send("ok");
}));


// 상품 썸네일 이미지 조회
router.get('/imgs/:src', asyncHandler(async(req, res, next)=>{
  const {src} = req.params;

  // 결과 반환
  res.sendFile(path.join(__dirname, `../product_imgs/${src}`));

}));

module.exports = router;

const { Router } = require('express');
const {ValidationError, asyncHandler} = require('../utils/async-handler');
const router = Router();
const passport = require("passport");

/* in models */
const CategorySchema = require('../schema/category');
const ProductSchema = require('../schema/product')
const mongoose = require('mongoose');
const Category = mongoose.model('Category', CategorySchema); 
const Product = mongoose.model('Product', ProductSchema);

/* joi schema  load */
const {postCategorySchema, deleteCategorySchema} =  require('./categoryValidation');

/* function to find category id */ 
async function findCategoryId(shortId){
  return Category.findOne({shortId});
}

// 카테고리 조회 : 모든 카테고리 리스트 반환
router.get('/', asyncHandler(async (req, res) => { 
  const data = await Category.find({})
  res.json(data);
}));

// 한 카테고리 추가
router.post('/', passport.authenticate('jwt-admin',{ session: false }), asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  // 유효성 검사
  await postCategorySchema.validateAsync({name});

  const categories = await Category.find({});
  if (categories.map(cate=>cate.name).includes(name)){
    throw new ValidationError(400,  '이미 등록된 카테고리입니다');
  }

  const post = await Category.create({name});
  res.json(post);
}));

// 카테고리 수정 : shortID 필요
router.post('/:categoryShortId', passport.authenticate('jwt-admin',{ session: false }), asyncHandler(async(req, res, next)=>{
  const {categoryShortId:shortId} = req.params;
  const { name } = req.body;
  // 유효성 검사
  await postCategorySchema.validateAsync({name});

  const isExistId = await findCategoryId(shortId);
  if (!isExistId){
    throw new ValidationError(404,  '존재하지 않는 카테고리 shortId입니다');
  }

  const isExistName = await Category.findOne({name});
  if (isExistName){
    throw new ValidationError(400,  '이미 존재하는 카테고리명입니다');
  }

  await Category.updateOne({shortId}, {name});
  res.send("ok");
}));

// 카테고리 삭제 : shortId 필요
router.delete("/:categoryShortId", passport.authenticate('jwt-admin',{ session: false }), asyncHandler(async(req, res, next)=>{
  const {categoryShortId:shortId} = req.params;
  // 유효성 검사
  await deleteCategorySchema.validateAsync({shortId});

  const isExistId = await findCategoryId(shortId);
  if (!isExistId){
    throw new ValidationError(404,  '존재하지 않는 카테고리 shortId입니다');
  }

  const isExistProduct = await Product.findOne({category:isExistId});
  if (isExistProduct){
    throw new ValidationError(400,  '해당 카테고리로 등록된 상품이 존재합니다. 해당 상품을 먼저 제거해주세요');
  }

  await Category.deleteOne({shortId});
  res.send("ok");
}));


module.exports = router;

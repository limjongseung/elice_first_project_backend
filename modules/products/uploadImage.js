const {Router} = require("express");
const path = require("path");
const router = Router();
const { nanoid } = require('nanoid');
const multer  = require('multer');

/* in DB models */
// const asyncHandler = require('../utils/async-handler');
// const mongoose = require('mongoose');
// const ProductSchema = require('../schema/product');  
// const Product = mongoose.model('Product', ProductSchema);

const thumbnailFileDir = './product_imgs'; 
// multer storage setting
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, thumbnailFileDir);
  },
  filename: (req, file, cb)=>{
    const fileType = file.mimetype.split('/')[1];
    cb(null, `${nanoid(10)}${Date.now()}.${fileType}`);
  }
});

// multer fileFilter setting
const fileFilter = (req, file, cb) => {
  const typeArray = file.mimetype.split('/');
  const fileType = typeArray[1];

  if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'webp') {
      req.fileValidationError = null;
      cb(null, true);
  } else {
      req.fileValidationError = "jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.";
      cb(null, false)
  }
};

// multer uploader setting
const uploadImg = multer({
  storage:thumbnailStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 //크기 제한 : 10MB
  }
})

module.exports = uploadImg;
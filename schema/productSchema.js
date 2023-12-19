const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const shortId = require('./types/short-id');
const ProductSchema = new mongoose.Schema(
  {
    shortId,
    name:{
      type:String,
      required: true,
    },
  
    price:{
      type:Number,
      required: true,
    },
  
    company:{
      type:String,
      required: true,
    },
  
    description:{
      type:String
    },
  
    img:{
      type:String
    },
  
    category:{
      type:Schema.Types.ObjectId,
      ref:'Category',
      required: true,
      index: true // 여기에 왜 index를 걸까
    },
  },
  
    {
      timestamps: true,
      collection: "products"
    }
  );

  module.exports =mongoose.model('products',ProductSchema)
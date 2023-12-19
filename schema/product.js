const {Schema} = require('mongoose');
const shortId = require('./types/short-id');

const ProductSchema = new Schema({
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
    type:String,
    required: true,
  },

  img:{
    type:String,
    required: true,
  },

  thumbnail:{
    type:String,
    required: true,
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
    collection: "products"}
);

module.exports = ProductSchema;
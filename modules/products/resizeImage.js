const fs = require('fs');
const sharp = require('sharp');

const resizeImg = async (fileName) => {
  sharp(fileName).resize({width:600}).withMetadata().toBuffer((err, buffer)=>{
    if(err){
      console.log("! 이미지를 압축하지 못했습니다. error message: ", err);
    }
    fs.writeFile(fileName,buffer, ()=>{
      if (err){
        console.log("!! 이미지를 압축하지 못했습니다. error message: ", err);
      }
    })
  })
};


module.exports = resizeImg;
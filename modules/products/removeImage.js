const fs = require('fs');

const removeImg = async (fileName) => {
  fs.unlink(fileName, (error)=>{
    if( error && error.code == 'ENOENT'){
      console.log(`삭제하려는 ${fileName} 파일이 존재하지 않습니다.`);
    }
    else if(error){
      throw new Error("파일 삭제 중 error 발생 : ", error);
    } 
  });
};


module.exports = removeImg;
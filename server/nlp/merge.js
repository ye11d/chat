var dataBuffer = Buffer.from(speech, 'base64');
var now = Date.now(); //获取系统当前时间数值
var savePath = './' + now + '.mp3'; //服务器存储文件名

const fs = require('fs')

fs.writeFile(savePath, dataBuffer, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('成功');
  }
});
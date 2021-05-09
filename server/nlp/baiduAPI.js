var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "24016877";
var API_KEY = "Buc9b7B6aCl1ep8ghj7SCL6C";
var SECRET_KEY = "vA6IvybQX6FH4rbXNzsRbqoZYGdLvSbg";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({ timeout: 5000 });

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function (requestOptions) {
  // 查看参数
  // console.log(requestOptions)
  // 修改参数
  requestOptions.timeout = 5000;
  // 返回参数
  return requestOptions;
});


let fs = require('fs');
let voice = fs.readFileSync('./16k_10.pcm');

let voiceBuffer = Buffer.from(voice);

// 识别本地文件
client.recognize(voiceBuffer, 'amr', 16000).then(function (result) {
  console.log('<recognize>: ' + JSON.stringify(result));
}, function (err) {
  console.log(err);
});

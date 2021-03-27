const md5 = require('md5-node');
const axios = require('axios');

const config = require('./config')

const fs = require('fs');
const qs = require('qs')

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//对象字典升序
function _sortObject(obj) {
  var keys = Object.keys(obj).sort()
  var newObj = {}
  for (var i = 0; i < keys.length; i++) {
    newObj[keys[i]] = obj[keys[i]]
  }
  return newObj
}
//生成sign
function signCreate(obj) {
  // 1. 对请求参数按字典升序排序
  let params = _sortObject(obj)
  // 2. 拼接键值对，value部分进行URL编码
  let paramStr = ''
  let keys = Object.keys(params)
  for (let idx in keys) {
    let key = keys[idx]
    paramStr += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  // 3. 拼接key
  paramStr += 'app_key=' + config.app_key
  // 4. md5
  return md5(paramStr).toUpperCase()
}

class BaseParams {
  constructor() {
    this.app_id = config.app_id
    this.time_stamp = parseInt(Date.now() / 1000)
    this.nonce_str = this.randomString()
  }
  randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
    for (let i = 0; i < e; i++) {
      n += t.charAt(Math.floor(Math.random() * a))
    }
    return n
  }
}

class ChatParams extends BaseParams {
  constructor(question) {
    super()
    this.session = '10000'
    this.question = question
    this.sign = signCreate(this)
  }
}

class SpeechSynthesisParams extends BaseParams {
  constructor(content) {
    super()
    this.speaker = 5 //普通话男声	1静琪女声	5欢馨女声	6碧萱女声	7
    this.format = 2 //PCM 1; WAV 2; MP3 3
    this.volume = 0 //合成语音音量，取值范围[-10, 10]，如-10表示音量相对默认值小10dB，0表示默认音量，10表示音量相对默认值大10dB
    this.speed = 80 //合成语音语速，默认100
    this.text = content
    this.aht = 0 //合成语音降低/升高半音个数，即改变音高，默认0
    this.apc = 58 // 控制频谱翘曲的程度，改变说话人的音色，默认58
    this.sign = signCreate(this)
  }
}

class SpeechRecognitionParams extends BaseParams {
  constructor(speech) {
    super()
    this.format = 2 //PCM	1;WAV	2;AMR	3;SILK	4
    this.speech = speech
    this.rate = 16000
    this.sign = signCreate(this)
  }
}

async function chat(question) {
  params = new ChatParams(question)
  // console.log('params', params)
  return new Promise((resolve, reject)=>{
    axios.get(config.chat_url,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        params: params
      })
      .then((res) => {
        // console.log(`Status: ${res.status}`);
        // console.log('Body: ', res.data);
        resolve(res.data.data.answer)
      }).catch((err) => {
        console.error(err);
        reject(err)
      });
  })
}

async function speechSynthesis(content) {
  params = new SpeechSynthesisParams(content)
  // console.log('params', params)
  return new Promise((resolve, reject) => {
    axios.get(config.AIlab_url,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        params: params
      })
      .then((res) => {
        // console.log(`Status: ${res.status}`);
        // console.log('Body: ', res.data);
        resolve(res.data.data.speech)
      }).catch((err) => {
        console.error(err);
        reject(err)
      });
  })
}

async function speechRecognition(speech) {
  params = new SpeechRecognitionParams(speech)
  // console.log('params', params)
  return new Promise((resolve, reject) => {
    axios.post(config.echo_url, qs.stringify(params))
      .then((res) => {
        // console.log(`Status: ${res.status}`);
        // console.log('Body: ', res.data);
        resolve(res.data.data.text)
      }).catch((err) => {
        console.log('error', err);
        // reject(err)
      });
  })
}

function Now() {
  let now = new Date()
  return `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
}

async function wait(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay);
  })
}

function saveWAV(speech) {
  var dataBuffer = Buffer.from(speech, 'base64')
  let now = Now()
  fs.writeFile(`${now}.WAV`, dataBuffer, (err) => {
    // console.log('error', err)
  })
  return `${now}.WAV`
}

async function contentToWAV(content) {
  let speech = await speechSynthesis(content)
  let savePosition= saveWAV(speech)
  return savePosition
}

async function __main() {
  let i = 1
  let content = "今天天气怎么样"
  let savePosition = await contentToWAV(content)
  console.log('a:', content, `------音频文件:`, `${savePosition}`)
  while(i > 0) {
    await wait(1000)
    if (i % 2 == 0){
      content = await chat(content)
      savePosition = await contentToWAV(content)
      console.log('b:', content, `------音频文件:`, `./${savePosition}`)
    } else {
      content = await chat(content)
      savePosition = await contentToWAV(content)
      console.log('a:', content, `------音频文件:`, `${savePosition}`)
    }
    i += 1
  }
}

__main()
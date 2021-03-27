const md5 = require('md5-node');
const axios = require('axios');

const config = require('./config')

class BaseParams {
  constructor(config) {
    this.app_id = config.app_id
    this.time_stamp = parseInt(Date.now() / 1000)
    this.nonce_str = this.randomString()
    this.sign = this.signCreate()
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
  _sortObject(obj) {
    var keys = Object.keys(obj).sort()
    var newObj = {}
    for (var i = 0; i < keys.length; i++) {
      newObj[keys[i]] = obj[keys[i]]
    }
    return newObj
  }
  signCreate() {
    // 1. 对请求参数按字典升序排序
    let params = this._sortObject(this)
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
}

async function chat(question) {
  class Params {
    constructor(config, question) {
      this.app_id = config.app_id
      this.session = '10000'
      this.question = question
      this.time_stamp = parseInt(Date.now() / 1000)
      this.nonce_str = this.randomString()
      this.sign = this.signCreate()
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
    _sortObject(obj) {
      var keys = Object.keys(obj).sort()
      var newObj = {}
      for (var i = 0; i < keys.length; i++) {
        newObj[keys[i]] = obj[keys[i]]
      }
      return newObj
    }
    signCreate() {
      // 1. 对请求参数按字典升序排序
      let params = this._sortObject(this)
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
  }
  params = new Params(config, question)

  return new Promise((resolve, reject)=>{
    axios.get(config.chat_url,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        params: params
      })
      .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
        resolve(res.data)
      }).catch((err) => {
        console.error(err);
        reject(err)
      });
  })
}

async function 
async function test() {
  let result = await chat('你好啊')
  console.log('回答', result)
}

test()
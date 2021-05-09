let config = {
  database: {
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '123456',
    database: 'chat',
  },
  session: {
    key: 'key',
    secret: 'secret',
  },
  server: {
    imgurl: 'http://192.168.0.103',
    port: 3200,
  },
  nlpconfig: {
    app_key: "U2fZhP5r5efXn6AC",
    app_id: 2162083024,
    chat_url: "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat",
    AIlab_url: "https://api.ai.qq.com/fcgi-bin/aai/aai_tts",
    echo_url: "https://api.ai.qq.com/fcgi-bin/aai/aai_asr",
    AIlab_speech: "https://api.ai.qq.com/fcgi-bin/aai/aai_asrs",
    long_speech: "https://api.ai.qq.com/fcgi-bin/aai/aai_wxasrlong"
  }
}
module.exports = config
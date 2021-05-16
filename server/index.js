const express = require('express')
const session = require('express-session');
const app = express()
const server = require('http').Server(app);

const io = require('socket.io')(server);

const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session); //session接数据库
const bodyParser = require('body-parser'); //解析req.body

const config = require('./config')

//中间件
//1.跨域
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*")
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type")
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
  if (req.method.toLowerCase() == 'options') {
    res.send(200);  //让options尝试请求快速结束
  } else {
    next()
  }
})
//2.解析req
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
//3.静态资源
app.use(express.static('public'))
//4.会话
const connection = mysql.createConnection(config.database)
const sessionStore = new MySQLStore({
  expiration: 10800000,
  createDatabaseTable: true,  //是否创建表
  schema: {
    tableName: 'session_tab',   //表名
    columnNames: {      //列选项
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, connection);
var sessionMiddleware = session({
  key: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  store: sessionStore,
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
})
//io获得session socket.request.session
io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
//app获得session req.session
app.use(sessionMiddleware)
//app扩大上传
app.use(bodyParser.json({ limit: "2100000kb" }));
// 解析 url编码
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
// app.use(express.json())


const { speechRecognition, chat, speechSynthesis } = require('./nlp')
const fs = require('fs')
function saveAMR(speech) {
  var dataBuffer = Buffer.from(speech, 'base64')
  fs.writeFile(`hhhh.AMR`, dataBuffer, (err) => {
    // console.log('error', err)
  })
  return `hhhh.AMR`
}

//音频->返回音频
app.post('/aiChat', async (req, res) => {
  // console.log('aichat')
  // console.log('req.body', req.body.base64, typeof(req.body))
  // for(key in req.body) {
  //   console.log('key', key)
  // }
  let content = await speechRecognition(req.body.base64)
  console.log('问:', content.result[0])
  let result = await chat(content.result[0])
  console.log('答:', result)
  let speech = await speechSynthesis(result)
  res.send(speech)
  // saveAMR(speech)
})

app.post('/aiChatContent', async (req, res) => {
  let content = await speechRecognition(req.body.base64)
  console.log('问:', content.result[0])
  let result = await chat(content.result[0])
  console.log('答:', result)
  res.send(result)
})

app.post('/speechSynthesis', async (req, res) => {
  let content = req.body.content
  let speech = await speechSynthesis(content)
  res.send(speech)
})

//废弃的路由
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  if (req.session.userinfo) {
    res.send("hello " + req.session.userinfo + "，welcome to index");
  } else {
    res.send("未登陆");
  }
});

app.get('/showme', async (req, res) => {
  console.log('req', req.session.userinfo)
  let user = await findUser(req.session.userinfo)
  res.json(user)
})

app.post('/login', async (req, res) => {
  let { username, password } = req.body
  let user = await loginUser(username, password)
  req.session.userinfo=username
  res.send(user)
})

app.post('/loginOut', (req, res) => {
  req.session.destroy(function(err){
    res.send('退出登录!' + err)
  })
})

//数据库封装
connection.connect();//链接数据库

var sqlQuery = function (...args) {
  return new Promise(function (resolve, reject) {
    connection.query(...args, function (err, result) {
      if (err) {
        reject(err)
      }
      if(result !== undefined) {
        let dataString = JSON.stringify(result);
        let data = JSON.parse(dataString);
        resolve(data)
      }
    })
  })
}

async function findUser(username) {
  var sql = `SELECT * FROM userlist where username='${username}'`;
  let result = await sqlQuery(sql)
  return result
}

async function findLikeUser(username) {
  var sql = `SELECT * FROM userlist where username like'%${username}%'`;
  let result = await sqlQuery(sql)
  return result
}

async function registryUser(username, password, socketid) {
  var addSqlStr = 'INSERT INTO userlist(id,username,password,headimg,isOnline,friends,socketid) VALUES(0,?,?,?,?,?,?)';

  let headimg = `${config.server.imgurl}:${config.server.port}/headimg/abc.jpg`
  // console.log('headimg', headimg)
  var addSqlParams = [username, password, headimg, 0, "", socketid];
  let result = await sqlQuery(addSqlStr, addSqlParams)
  return result
}

async function updateUser(username, paramtype, newparams) {
  var sql = `UPDATE userlist SET ${paramtype}='${newparams}' WHERE username='${username}'`;
  await sqlQuery(sql)
  let newuserlist = await findUser(username)
  let newuser = newuserlist[0]
  return newuser
}

async function updateUserFriend(username, friendname) {
  let userlist = await findUser(username)
  let user = userlist[0]
  console.log('update', username, user, 'friend', friendname)
  let friends = []
  console.log('user.friends', user.friends, user.friendname !== '')
  if (user.friends !== '' && user.friends !== undefined) {
    console.log('非空', user.friends)
    friends = JSON.parse(user.friends)
  }
  friends.push(friendname)
  friends = JSON.stringify(friends)

  console.log('updatefriend', username , friendname, friends)
  let newuser = await updateUser(username, 'friends', friends)
  return newuser
}

async function updateUserOnlice(username, isOnline, socketid){
  console.log('updateUserOnlice', username, isOnline, socketid)
  await updateUser(username, 'isOnline', isOnline)
  let newuser = await updateUser(username, 'socketid', socketid)
  return newuser
}

async function loginUser(username, password, socketid) {
  let userlist = await findUser(username)
  if (userlist.length === 0) {
    await registryUser(username, password, socketid)
  }
  await updateUserOnlice(username, 1, socketid)
  userlist = await findUser(username)
  let user = userlist[0]
  //更新socketid
  return user
}

//socket
io.on('connection', async (socket) => {
  console.log('已有session', socket.request.session.userinfo)
  if (socket.request.session.userinfo !== undefined) {
    console.log('已有session', socket.request.session.userinfo)
    let user = await findUser(socket.request.session.userinfo)
    console.log('user', user)
    if(user == []){
      console.log('没找到对应用户')
    } else {
      console.log('login', socket.id, user)
      socket.emit('login', user)
    }
  }
  //登录
  socket.on('login', async (data) => {
    let { username, password } = data
    console.log('login socket.id', socket.id)
    let user = await loginUser(username, password, socket.id)
    socket.request.session.userinfo = user.username
    console.log('login', socket.id, user)
    socket.emit('login', user)
  })
  //登出
  socket.on('loginout', ()=>{
    
  })
  //用户断开连接
  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id, socket.request.session.userinfo);
    await updateUserOnlice(socket.request.session.userinfo, 0, socket.id)
  });

  //查询用户(添加好友)
  socket.on('finduser', async (data) => {
    if (data) {
      console.log('查询了', data)
      let user = await findLikeUser(data)
      if (user.length != 0) {
        socket.emit('finduser', user)
      }
    }
    else {
      console.log('为空不查询')
    }
    // socket.emit('finduser', user)
  })
  //查询用户(好友列表)
  socket.on('findfriend', async (data) => {
    if (data) {
      console.log('查询了', data, data.length)
      var userlist = []
      for(i = 0; i < data.length; i++) {
        let user = await findUser(data[i])
        if (user.length != 0) {
          userlist.push(user[0])
        }
      }
      console.log('userlist', userlist)
      socket.emit('findfriend', userlist)
      // if (userlist.length != 0) {
      //   socket.emit('findfriend', user)
      // }
    }
    else {
      console.log('为空不查询')
    }
  })
  //添加好友
  socket.on('addFriend', async (data) => {
    console.log('addfriend event on, data:', data)
    let newuser = await updateUserFriend(data.from, data.to)
    console.log('add new', newuser)
    socket.emit('addFriendOk', newuser)
  })


  //聊天内容
  socket.on('singlechat', async (msg) => {
    console.log('发送来的msg', msg, socket.id)
    let user = await findUser(msg.to)
    let toSocketid = user[0].socketid
    console.log('to', toSocketid)
    io.to(toSocketid).emit('singlechat', msg)
  })
  socket.on('chat message', (msg) => {
    // io.emit('chat message', msg);
    console.log('message data: ' + msg);
  });

  socket.on('aiChat', (msg) => {

  })
});



server.listen(config.server.port, () => {
  console.log('listening on *:'+config.server.port);
});
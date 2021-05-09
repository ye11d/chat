const mysql = require('mysql');
const config = require('./config')
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3000,
  user: 'root',
  password: '123456',
  database: 'chat',
})


//改
function sqlUpdate() {
  var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
  var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 6];

  connection.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
    console.log('--------------------------UPDATE----------------------------');
    console.log('UPDATE affectedRows', result.affectedRows);
    console.log('-----------------------------------------------------------------\n\n');
  });
}

function sqlDelete() {
  var delSql = 'DELETE FROM websites where id=6';

  connection.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------DELETE----------------------------');
    console.log('DELETE affectedRows', result.affectedRows);
    console.log('-----------------------------------------------------------------\n\n');
  });
}

// sqlRetrieve()
// sqlCreate()
// sqlUpdate()
// sqlDelete()

var sqlQuery = function (...args) {
  return new Promise(function (resolve, reject) {
    connection.query(...args, function (err, result) {
      if (err) {
        reject(err)
      }
      if (result !== undefined) {
        let dataString = JSON.stringify(result);
        let data = JSON.parse(dataString);
        resolve(data)
      }
    })
  })
}


async function updateUser(user) {
  var sql = `UPDATE userlist SET friends=${friends} WHERE username = ${user.username}`;
  let result = await sqlQuery(sql)
  return result
}

async function findUser(username) {
  var sql = `SELECT * FROM userlist where username='${username}'`;
  let result = await sqlQuery(sql)
  return result
}

async function registryUser(username, password) {
  var addSqlStr = 'INSERT INTO userlist(id,username,password,headimg,isOnlice,friends) VALUES(0,?,?,?,?,?)';

  let headimg = `${config.server.imgurl}:${config.server.port}/headimg/abc.jpg`
  // console.log('headimg', headimg)
  var addSqlParams = [username, password, headimg, 1, ""];
  let result = await sqlQuery(addSqlStr, addSqlParams)
  connection.end()
  return result
}

// registryUser('王五', 1233)

async function loginUser(username, password) {
  let user = await findUser(username)
  if (user.length === 0) {
    user = await registryUser(username, password)
    // console.log(result)
  } else {
    console.log('已注册, 登录中')
    return user[0]
  }
}

function checkTableExist() {
  connection.connect();
  var checkTableStr = "CREATE TABLE If Not Exists chat.userlist(id int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, password varchar(255) NOT NULL, headimg varchar(255) NOT NULL, isOnline tinyint(1) NOT NULL, friends text NOT NULL,  socketid varchar(255) NOT NULL, PRIMARY KEY(id, username))"
  connection.query(checkTableStr, function (err, result) {
    if (err) { throw err } else {
    }
  })
  connection.end()
}

checkTableExist()
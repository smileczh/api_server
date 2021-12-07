// 导入数据库操作模块
const db = require('../db/index')
// 导入bcrypt.js这个包
const bcrypt = require('bcryptjs')

// 导入配置文件
const config = require('../config')
// 用这个包生成token字符串
const jwt = require('jsonwebtoken')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 对表单中的数据，进行合法性的校验
  // if (!userinfo.username || !userinfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不合法！' })
  // }

  // 定义sql语句，查询用户名是否被占用
  const sqlstr = `select * from ev_users where username=?`
  db.query(sqlstr, userinfo.username, (err, results) => {
    // 执行sql语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // 调用bcrypt.hashSync() 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 定义插入新用户的sql语句
    const sql = 'insert into ev_users set ?'
    // 调用db.query()执行sql语句
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      // 判断sql语句是否执行成功
      // if (err) return res.send({ status: 1, message: err.message })
      if (err) return res.cc(err)
      // 判断影响行数是否为1
      // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      // 注册用户成功
      // res.send({ status: 0, message: '注册成功！' })
      res.cc('注册成功！', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const userinfo = req.body

  const sql = 'select * from ev_users where username=?'

  db.query(sql, userinfo.username, (err, results) => {
    // 判断sql语句是否执行成功
    if (err) return res.cc(err)
    // 执行sql语句成功，但是查询到数据条数不等于1
    if (results.length !== 1) return res.cc('登录失败！')

    // 拿用户输入的密码，和数据库中存储的密码对比
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)

    // 如果对比的结果等于 false，则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }

    const user = { ...results[0], password: '', userinfo: '' }
    // 生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn  // token有效期为10小时
    })
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用token，在服务器端直接拼接上 Bearer的前缀
      token: 'Bearer ' + tokenStr
    })
  })
}
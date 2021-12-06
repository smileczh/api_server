
// 导入express
const express = require('express')

// 创建服务器实例
const app = express()

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件，注意： 这个中间件，只能解析application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前，风脏res.cc函数
app.use((req, res, next) => {
  // status 默认值为1，表示失败的情况
  // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? error.message : err
    })
  }
  next()
})

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
app.get('/', (req, res) => {
  res.send('123')
})
// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})
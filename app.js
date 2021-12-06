
// 导入express
const express = require('express')

// 创建服务器实例
const app = express()

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors)

//配置解析表单数据的中间件，注意： 这个中间件，只能解析application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://120.0.0.1:3007');
})
// 1、导入 express 模块
const express = require('express');
// 2、创建 express 服务器实例
const app = express();
// 捕获验证
const joi = require('joi')
const bodyParser = require('body-parser');

// 导入 cors 中间件
const cors = require('cors');
// 将cors 注册为全局中间件
app.use(cors());

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
// app.use(express.urlencoded({ extended: false }))

app.use(bodyParser.urlencoded({ extended: true }));

// 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为1，表示失败的情况
    // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 在 app.js 中，导入并使用用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)

// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter);

// 导入并使用车辆管理的路由模块
const vehicleRouter = require('./router/registration')
app.use('/vehicle', vehicleRouter);


// 错误中间件
app.use(function (err, req, res, next) {
    console.log(err);
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})


// 3、调用 app.listen 方法，指定端口号并启动web服务器
app.listen('3007', function () {
    console.log('api server running at http://127.0.0.1:3007')
})
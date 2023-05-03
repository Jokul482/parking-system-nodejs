// 这是文章分类的路由模块
const express = require("express");
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_cate_schema } = require('../schema/artcate')

// 获取文章分类列表数据的路由
router.get('/cates', artCate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema) , artCate_handler.addArticleCates)

module.exports = router
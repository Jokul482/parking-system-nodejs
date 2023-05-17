const express = require('express');
const router = express.Router();

// 导入收费统计路由处理函数对应的模块
const chargeHandler = require('../router_handler/charge')

// 获取收费统计列表数据的路由
router.get("/getChargeList", chargeHandler.getChargeList)

module.exports = router
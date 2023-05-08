const express = require('express');
const router = express.Router();

// 导入用户路由处理函数对应的模块
const registerHandler = require('../router_handler/access')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { vehicle_schema } = require('../schema/access')
// 获取车辆列表数据的路由
router.get("/getRegistrationList", registerHandler.getVehicleRegistrationList)
// 新增车辆登记数据的路由
router.post("/AddVehicle", expressJoi(vehicle_schema), registerHandler.postAddVehicle)

module.exports = router
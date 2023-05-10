const express = require('express');
const router = express.Router();

// 导入用户路由处理函数对应的模块
const vehicleHandler = require('../router_handler/vehicle')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
// const {  } = require('../schema/vehicle')
// 获取车位列表数据的路由
router.get("/getVehicleList", vehicleHandler.getVehicleList)
// 新增车位数据的路由
router.post("/postAddVehicle", vehicleHandler.postAddVehicle)
// 获取车位数据的路由
router.get("/getVehicleInfo", vehicleHandler.getVehicleInfo)
// 更新车位数据的路由
router.post("/postUpdateVehicleInfo", vehicleHandler.postUpdateVehicleInfo)
// 删除车位数据的路由
router.get("/deleteVehicleInfo/:id", vehicleHandler.deleteVehicleInfo)

module.exports = router
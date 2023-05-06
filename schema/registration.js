// 1、导入定义验证规则的模块
const joi = require('joi')
// 车牌号
const plateNumber = joi.string().required();
// 车位号
const carNumber = joi.string().required();
// 车主姓名
const ownerName = joi.string().required();
// 车主电话
const phone = joi.number().required();
// 车辆类型
const type = joi.number().required();
// 每小时收费
const chargeHour = joi.number().required();

// 车辆添加及编辑表单的验证规则对象
exports.vehicle_schema = {
	// 表示需要对 req.body 中的数据进行验证
	body: {
		plateNumber,
        carNumber,
        ownerName,
        phone,
        type,
        chargeHour
	}
}
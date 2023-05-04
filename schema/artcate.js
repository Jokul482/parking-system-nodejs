// 1、导入定义验证规则的模块
const joi = require('joi')

// 2、定义 name 和 alias 的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// id的校验规则
const id = joi.number().integer().min(1).required()

// 3、向外共享验证规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}
// 验证规则对象 - 删除分类
exports.delete_cate_schema = {
    params: {
        id
    }
}
// 验证规则对象 - 根据 id 获取列表分类
exports.get_cate_schema = {
    params: {
        id
    }
}

// 验证规则对象 - 根据 id 更新列表分类
exports.update_cate_schema = {
    body: {
        Id:id,
        name,
        alias
    }
}
// 导入数据库操作模块
const db = require("../db/index");

exports.getStallList = (req, res) => {
    const sql = "select * from access where is_delete=0"
}
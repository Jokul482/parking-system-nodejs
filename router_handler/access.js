// 导入数据库操作模块
const db = require("../db/index");

// 车辆列表的处理函数
exports.getVehicleRegistrationList = (req, res) => {
    // 获取查询参数
    const { plateNumber, carNumber, phone } = req.query;
    let sql =
        "select * from access where is_delete=0";
    if (plateNumber && carNumber && phone) {
        sql += ` and plateNumber like concat('%',${plateNumber},'%') and carNumber like concat('%',${carNumber},'%') and phone like concat('%',${phone},'%')`;
    } else if (plateNumber && carNumber) {
        sql += ` and plateNumber like concat('%',${plateNumber},'%') and carNumber like concat('%',${carNumber},'%')`;
    } else if (plateNumber && phone) {
        sql += ` and plateNumber like concat('%',${plateNumber},'%') and phone like concat('%',${phone},'%')`;
    } else if (carNumber && phone) {
        sql += ` and carNumber like concat('%',${carNumber},'%') and phone like concat('%',${phone},'%')`;
    } else if (plateNumber) {
        sql += ` and plateNumber like concat('%',${plateNumber},'%')`;
    } else if (carNumber) {
        sql += ` and carNumber like concat('%',${carNumber},'%')`;
    } else if (phone) {
        sql += ` and phone like concat('%',${phone},'%')`;
    }
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results.length === 0) return res.send({ status: 0, data: [] })
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: "获取成功！",
            data: results
        });
    });
}

// 添加车辆的处理函数
exports.postAddVehicle = (req, res) => {
    // 获取客户端提交到服务器的车辆信息
    const carInfo = req.body;
    // 定义 SQL 语句，查询车牌号是否被占用
    const sqlStr1 = 'select * from access where plateNumber=? and carNumber=?';
    // // 定义 SQL 语句，查询车牌号是否被占用
    // const sqlStr2 = 'select * from access where plateNumber=?';
    // 定义插入车辆的 sql 语句
    const sql = 'insert into access set ?'
    db.query(sqlStr1, [carInfo.plateNumber, carInfo.carNumber], (err, results) => {
        // 执行 sql 语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断车牌号是否被占用
        if (results.length > 0) {
            return res.cc('不能重复登记车牌号或车位号！')
        }
        
        // // 调用 db.query() 执行 sql 语句
        // db.query(sql, req.body, (err, results) => {
        //     // 判断 sql 语句是否执行成功
        //     if (err) return res.cc(err);
        //     // 判断影响行数是否为 1
        //     if (results.affectedRows !== 1) return res.cc('添加车辆失败，请稍后再试！');
        //     // 注册用户成功
        //     res.cc('添加成功！', 0);
        // })
    })
}
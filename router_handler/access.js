// 导入数据库操作模块
const db = require("../db/index");

// 车辆列表的处理函数
exports.getVehicleRegistrationList = (req, res) => {
    // 获取查询参数
    const { plateNumber, carNumber, phone, status } = req.query;
    let sql = "select * from access where is_delete=0";
    if (plateNumber) {
        sql += ` and plateNumber like concat("%${plateNumber}%")`;
    } else if (carNumber) {
        sql += ` and carNumber like concat("%${carNumber}%")`;
    } else if (phone) {
        sql += ` and phone like concat("%${phone}%")`;
    } else if (status) {
        sql += ` and status=${status}`;
    }
    // 查询车位表拿到所有车位的费用信息
    let otherSql =
        "select id, carNumber, chargeHour from vehicle where is_delete=0";
    db.query(sql, (err, results1) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results1.length === 0) return res.send({ status: 0, data: [] })
        db.query(otherSql, (err, results2) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
            // if (results.length === 0) return res.send({ status: 0, data: [] })
            results1 = results1.map(item1 => {
                const item2 = results2.find(item2 => item1.carNumber === item2.carNumber);
                return item2 ? { ...item1, chargeHour: item2.chargeHour } : item1;
            });
            // 3. 将用户信息响应给客户端
            res.send({
                status: 0,
                message: sql,
                data: results1
            });
        })
    });
}

// 获取车位列表的处理函数
exports.getVehicleInfo = (req, res) => {
    const sql = `select id, carNumber from vehicle where is_delete=0`;
    // res.send(req.query)
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results.length === 0) return res.send({ status: 0, data: [] })
        // 3. 将车位信息响应给客户端
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
    // 定义 SQL 语句，查询车牌号是否正在停车
    const sqlStr = 'select * from access where is_delete=0 and carNumber=?';
    // 定义插入车辆的 sql 语句
    const sql = 'insert into access set ?';
    // 定义该车位的每小时收费的 sql 语句
    const chargeSql = `select id, carNumber, chargeHour from vehicle where is_delete=0`;
    // 定义更新车位状态的 sql 语句
    const vehicleSql = `update vehicle set status=? where carNumber=?`;
    db.query(sqlStr, carInfo.carNumber, (err, results1) => {
        // 执行 sql 语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断车牌号是否被占用
        if (results1.length > 0) {
            return res.cc('该车位已使用，请选择其它车位！')
        }
        db.query(chargeSql, (err, results2) => {
            // 判断 sql 语句是否执行成功
            if (err) return res.cc(err);
            // 在 vehicle 表里找到对应的chargeHour字段
            results2.forEach(item => {
                return carInfo.chargeHour = item.carNumber == carInfo.carNumber ? item.chargeHour : null;
            });
            db.query(vehicleSql, [2, carInfo.carNumber], (err) => {
                // 判断 sql 语句是否执行成功
                if (err) return res.cc(err);
                // 调用 db.query() 执行 sql 语句
                db.query(sql, carInfo, (err, results) => {
                    // 判断 sql 语句是否执行成功
                    if (err) return res.cc(err);
                    // 判断影响行数是否为 1
                    if (results.affectedRows !== 1) return res.cc('添加失败，请稍后再试！');
                    // 注册用户成功
                    res.cc('添加成功！', 0);
                })
            })
        })
    })
}

// 获取车辆的处理函数
exports.getRegistrationInfo = (req, res) => {
    // 根据用户的 id，查询车辆的基本信息
    const sql = `select * from access where id=?`;
    // const sql = `select id, plateNumber, carNumber, ownerName, phone, type, exittime from access where id=?`;
    db.query(sql, req.query.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc("获取失败！");
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: "获取成功！",
            data: results[0],
        });
    });
}

// 更新车辆的处理函数
exports.postRegistrationInfo = (req, res) => {
    // 获取客户端提交到服务器的车辆信息
    const carInfo = req.body;
    // 定义 SQL 语句，查询车牌号是否正在停车
    const sqlStr = 'select * from access where carNumber=?';
    // 定义更新车辆的 sql 语句
    const sql = `update access set ? where id=?`;
    db.query(sqlStr, carInfo.carNumber, (err, results) => {
        // 执行 sql 语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断车牌号是否被占用
        if (results.length > 1) {
            return res.cc('该车位已使用，请选择其它车位！')
        }
        db.query(sql, [req.body, req.body.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 执行 SQL 语句成功，但影响行数不为 1
            if (results.affectedRows !== 1) return res.cc("修改失败！");
            // 修改用户信息成功
            return res.cc("修改成功！", 0);
        });
    })
}

// 删除车辆的处理函数
exports.deleteRegistration = (req, res) => {
    // 定义标记删除的 SQL 语句
    const sql = 'update access set is_delete=1 where id=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除失败！');
        res.cc('删除成功！', 0)
    })
}

// 获取车辆结算数据的处理函数
exports.getSettlementList = (req, res) => {
    // 获取查询参数
    const { plateNumber, carNumber, phone, status } = req.query;
    let sql = "select * from access where is_delete=0";
    if (plateNumber) {
        sql += ` and plateNumber like concat("%${plateNumber}%")`;
    } else if (carNumber) {
        sql += ` and carNumber like concat("%${carNumber}%")`;
    } else if (phone) {
        sql += ` and phone like concat("%${phone}%")`;
    } else if (status) {
        sql += ` and status=${status}`;
    }
    // 查询车位表拿到所有车位的费用信息
    let otherSql =
        "select id, carNumber, chargeHour from vehicle where is_delete=0";
    db.query(sql, (err, results1) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results1.length === 0) return res.send({ status: 0, data: [] })
        db.query(otherSql, (err, results2) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
            // if (results.length === 0) return res.send({ status: 0, data: [] })
            results1 = results1.map(item1 => {
                const item2 = results2.find(item2 => item1.carNumber === item2.carNumber);
                return item2 ? { ...item1, chargeHour: item2.chargeHour } : item1;
            });
            // 3. 将用户信息响应给客户端
            res.send({
                status: 0,
                message: "获取成功！",
                data: results1
            });
        })
    });
}

// 车辆进行结算的处理函数
exports.postSettlementDeparture = (req, res) => {
    // 获取客户端提交到服务器的结算信息
    const { leavingTime, duration, amount, id, carNumber } = req.body;
    // 定义更新车辆结算数据的 sql 语句
    const sql = `update access set leavingTime=?, duration=?, amount=?, status=? where id=?`;
    // 定义更新车位状态数据的 sql 语句
    const vehicleSql = `update vehicle set status=? where carNumber=?`
    db.query(sql, [leavingTime, duration, amount, 1, id], (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        db.query(vehicleSql, [1, carNumber], (err, results2) => {
            // 执行 SQL 语句成功，但影响行数不为 1
            if (results2.affectedRows !== 1) return res.cc("结算失败！");
            // 修改用户信息成功
            return res.cc("结算成功！", 0);
        })
    });
}
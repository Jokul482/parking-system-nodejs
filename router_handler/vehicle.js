// 导入数据库操作模块
const db = require("../db/index");

// 车位列表的处理函数
exports.getVehicleList = (req, res) => {// 获取查询参数
    const { area, carNumber, status } = req.query;
    let sql =
        "select * from vehicle where is_delete=0";
    if (area) {
        sql += ` and area=${area}`;
    } else if (carNumber) {
        sql += ` and carNumber like "%${carNumber}%"`;
    } else if (status) {
        sql += ` and status=${status}`;
    }
    // // 查询车辆表拿到所有车辆的支付信息
    // let otherSql =
    //     "select id, carNumber, status from access where is_delete=0";
    db.query(sql, (err, results1) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results1.length === 0) return res.send({ status: 0, data: [] })
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取成功！',
            data: results1
        });
    });
}

// 新增车位的处理函数
exports.postAddVehicle = (req, res) => {
    // 获取客户端提交的数据
    const info = req.body;
    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from vehicle where carNumber=?';
    // 定义插入用户的 sql 语句
    const sql = 'insert into vehicle set ?'
    db.query(sqlStr, info.carNumber, (err, results) => {
        // 执行 sql 语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            return res.cc('请勿添加重复车位！')
        }
        // 调用 db.query() 执行 sql 语句
        db.query(sql, {
            carNumber: info.carNumber,
            area: info.area,
            chargeHour: info.chargeHour,
            remarks: info.remarks,
            type: info.type,
            status: info.status
        }, (err, results) => {
            // 判断 sql 语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('车位失败，请稍后再试！');
            // 注册用户成功
            res.cc('添加成功！', 0);
        })
    })
}

// 获取车位的处理函数
exports.getVehicleInfo = (req, res) => {
    // 根据用户的 id，查询车位的基本信息
    const sql = `select * from vehicle where id=?`;
    db.query(sql, req.query.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc("获取车位失败！");
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: "获取车位信息成功！",
            data: results[0],
        });
    });
}

// 更新车位的处理函数
exports.postUpdateVehicleInfo = (req, res) => {
    const sql = `update vehicle set ? where id=?`;
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc("修改车位信息失败！");
        // 修改用户信息成功
        return res.cc("修改车位信息成功！", 0);
    });
}

// 删除车位的处理函数
exports.deleteVehicleInfo = (req, res) => {
    // 定义标记删除的 SQL 语句
    const sql = 'update vehicle set is_delete=1 where id=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除失败！');
        res.cc('删除成功！', 0)
    })
}

// 统计车位的处理函数
exports.getStatisticsList = (req, res) => {
    const { area, carNumber, status } = req.query;
    let sql =
        "select * from vehicle where is_delete=0";
    if (area) {
        sql += ` and area=${area}`;
    } else if (carNumber) {
        sql += ` and carNumber like "%${carNumber}%"`;
    } else if (status) {
        sql += ` and status=${status}`;
    }
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

// 车位数据统计数据的路由
exports.getStatisticsData = (req, res) => {
    let sql = "select id, carNumber, status from vehicle where is_delete=0";
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
        if (results.length === 0) return res.send({ status: 0, data: [] })
        // 3. 统计
        let data = {
            total: undefined,
            inuse: "",
            idle: ""
        };
        // 统计数组中有多少个carNumber
        data.total = results.length;
        // 分别统计status等于1或者等于2的数量
        results.forEach(item => {
            if (item.status == 1) {
                data.idle++;
            } else if (item.status == 2) {
                data.inuse++;
            }
        });
        // 4. 将车位信息响应给客户端
        res.send({
            status: 0,
            message: "获取成功！",
            data: data
        });
    });
}
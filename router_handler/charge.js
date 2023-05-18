// 导入数据库操作模块
const db = require("../db/index");
const { timeTransformation } = require("../utils/general");

// 收费统计列表的路由
exports.getChargeList = (req, res) => {
    // 获取查询参数
    const { area, carNumber } = req.query;
    // 定义查询车辆数据的 sql 语句
    let sql = "select * from vehicle where is_delete=0";
    // 定义查询停车量与收费的 SQL 语句
    const ohterSql = 'select * from access where is_delete=0 and status=1';
    // 定义插入charge表数据的 SQL 语句
    let insertSql = `INSERT INTO charge ( area, carNumber, type, parkQuantity, todayCharge) VALUES `;
    let selectSql = `SELECT DISTINCT area, carNumber, type, parkQuantity, todayCharge FROM charge where 1=1`;
    if (area) {
        selectSql += ` and area like concat("%${area}%")`;
    } else if (carNumber) {
        selectSql += ` and carNumber like concat("%${carNumber}%")`;
    }
    db.query(sql, (err, results1) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        db.query(ohterSql, (err, results2) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
            // if (results2.length === 0) return res.send({ status: 0, data: [] })
            // 1、将今日结算的车位号筛选出来
            const dayTime = timeTransformation(new Date().getTime()).slice(0, 10);
            results2 = results2.filter(item => item.leavingTime.slice(0, 10) === dayTime)
            if (results2.length === 0) return res.send({ status: 0, data: [] })
            /* 
                1、创建一个空字典 carNumberDict，用于存储每个 carNumber 的总 amount 值和出现次数 parkQuantity。
                2、遍历数组中的每个对象：
                    a. 获取当前对象的 carNumber 和 amount 值。
                    b. 检查 carNumberDict 中是否已存在当前 carNumber，如果存在，则将当前 amount 值累加到已存在的 todayCharge 值上，并将对应的 parkQuantity 值加一。
                    c. 如果 carNumber 不存在于 carNumberDict 中，则在 carNumberDict 中添加一个新的键值对，其中键为当前 carNumber，值为一个字典，包含 amount 和 parkQuantity，并将 parkQuantity 设置为 1。
                3、创建一个空数组 resultArr，用于存储处理后的对象。
                4、遍历 carNumberDict 中的每个键值对，构造新的对象：
                    a. 创建一个新的对象，复制当前键值对中的 carNumber、todayCharge 和 parkQuantity。
                    b. 将新对象添加到 resultArr 数组中。
                5、返回 resultArr 数组作为结果。
            */
            let carNumberDict = results2.reduce((dict, obj) => {
                let carNumber = obj.carNumber;
                let todayCharge = obj.amount;
                let area = obj.area;
                let type = obj.type;
                if (dict.hasOwnProperty(carNumber)) {
                    dict[carNumber].todayCharge += todayCharge;
                    dict[carNumber].parkQuantity += 1;
                } else {
                    dict[carNumber] = {
                        todayCharge: todayCharge,
                        parkQuantity: 1,
                        area: area,
                        type: type
                    };
                }
                return dict;
            }, {});
            console.log(carNumberDict);
            results1 = Object.keys(carNumberDict).map(carNumber => {
                return {
                    carNumber: carNumber,
                    todayCharge: carNumberDict[carNumber].todayCharge,
                    parkQuantity: carNumberDict[carNumber].parkQuantity,
                    area: carNumberDict[carNumber].area,
                    type: carNumberDict[carNumber].type
                };
            });
            // 插入数据
            results1.forEach((obj) => {
                insertSql += `( '${obj.area}', '${obj.carNumber}', ${obj.type}, ${obj.parkQuantity}, ${obj.todayCharge} ),`
            });
            insertSql = insertSql.slice(-1) === ',' ? insertSql.slice(0, -1) + ';' : insertSql;
            db.query(insertSql, (err) => {
                // 1. 执行 SQL 语句失败
                if (err) return res.cc(err);
                db.query(selectSql, (err, results4) => {
                    // 1. 执行 SQL 语句失败
                    if (err) return res.cc(err);
                    // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
                    if (results4.length === 0) return res.send({ status: 0, data: [] })
                    // 3. 将用户信息响应给客户端
                    res.send({
                        status: 0,
                        message: "获取成功！",
                        data: results4
                    });
                })
            })
        })
    })
}

// 收费概览的路由
exports.getOverviewData = (req, res) => {
    // // 定义收费统计列表的 SQL 语句
    // let sql = `SELECT DISTINCT area, carNumber, type, parkQuantity, todayCharge FROM charge`;
    // db.query(sql, (err, results) => {
    //     // 1. 执行 SQL 语句失败
    //     if (err) return res.cc(err);
    //     // 2. 执行 SQL 语句成功，但是查询到的数据条数等于0
    //     if (results.length === 0) return res.send({ status: 0, data: {} })
    //     // 定义一个obj对象
    //     let obj = {
    //         totalCharge: 0, // 总收费
    //         aTotalCharge: 0, // A区总收费
    //         bTotalCharge: 0, // B区总收费
    //         cTotalCharge: 0, // C区总收费
    //     }
    //     // 总收费
    //     results.forEach(item => {
    //         obj.totalCharge += item.todayCharge;
    //     })
    //     console.log(results);
    //     // // 3. 将用户信息响应给客户端
    //     // res.send({
    //     //     status: 0,
    //     //     message: "获取成功！",
    //     //     data: results
    //     // });
    // })
    // 定义查询停车量与收费的 SQL 语句
    const sql = 'select * from access where is_delete=0 and status=1';
    let obj = {
        totalCharge: 0, // 总收费
        aTotalCharge: 0, // A区总收费
        bTotalCharge: 0, // B区总收费
        cTotalCharge: 0, // C区总收费
    }
    db.query(sql, (err, results2) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 获取历史总收费
        results2.forEach(item => {
            obj.totalCharge += item.amount;
            obj.aTotalCharge += item.area == 1 ? item.amount : 0;
            obj.bTotalCharge += item.area == 2 ? item.amount : 0;
            obj.cTotalCharge += item.area == 3 ? item.amount : 0;
        });
        res.send({
            status: 0,
            message: "获取成功！",
            data: obj
        });
    })
}
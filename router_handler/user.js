// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 模块
const bcrypt = require('bcryptjs');
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body;
    if(!userInfo.role_type) return res.send({ status: 1, message: '未选择角色类型' })
    // 对表单中数据，进行合法性的校验
    if (!userInfo.username || !userInfo.password) return res.send({ status: 1, message: '用户名或密码不合法' })

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    // 定义插入用户的 sql 语句
    const sql = 'insert into ev_users set ?'
    db.query(sqlStr, userInfo.username, (err, results) => {
        // 执行 sql 语句失败
        if (err) {
            return res.cc(err);
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其它用户名！')
        }
        // TODO: 用户名可以使用
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        // 调用 db.query() 执行 sql 语句
        db.query(sql, { 
            role_type: userInfo.role_type,
            username: userInfo.username, 
            password: userInfo.password,
            nickname: userInfo.nickname,
            email: userInfo.email,
         }, (err, results) => {
            // 判断 sql 语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！');
            // 注册用户成功
            res.cc('注册成功！', 0);
        })
    })
}
// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据：
    const userinfo = req.body;
    // 定义 SQL 语句：
    const sql = `select * from ev_users where username=?`;
    // 执行 SQL 语句，查询用户的数据：
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败,无此账号！')
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败,密码错误！')
        }
        // TODO：登录成功，生成 Token 字符串
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' };
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        })
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
            roleType: results[0].role_type
        })
    })
}
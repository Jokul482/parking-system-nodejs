// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 模块
const bcrypt = require('bcryptjs');

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body;
    // 对表单中数据，进行合法性的校验
    if(!userInfo.username || !userInfo.password) {
        return res.send({status: 1, message: '用户名或密码不合法'})
    }

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    // 定义插入用户的 sql 语句
    const sql = 'insert into ev_users set ?'
    db.query(sqlStr, userInfo.username, (err, results) => {
        // 执行 sql 语句失败
        if(err) {
            return res.cc(err);
        }
        // 判断用户名是否被占用
        if(results.length > 0) {
            return res.cc('用户名被占用，请更换其它用户名！')
        }
        // TODO: 用户名可以使用
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        // 调用 db.query() 执行 sql 语句
        db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results) => {
            // 判断 sql 语句是否执行成功
            if(err) return res.cc(err);
            // 判断影响行数是否为 1
            if(results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！');
            // 注册用户成功
            res.cc('注册成功！',0);
        })
    })
}
// 登录的处理函数
exports.login = (req, res) => {
    
}
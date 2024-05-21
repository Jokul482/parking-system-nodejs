const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1', // 根据您的环境选择
    user: 'root',
    password: '123456', // 这里应替换为实际的数据库root用户的密码，示例中使用的是常见的默认密码，实际使用时应更安全
    database: 'db_parkade', // 修改为您的数据库名
    port: 3306, // MySQL默认端口，如果您的数据库不是用默认端口可以加上这行
    timezone:"SYSTEM"
})

module.exports = db;
// 导入数据库操作模块
const db = require("../db/index");

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为0表示没有被标记为删除的数据
    const sql = "select * from ev_article_cate where is_delete=0 order by id asc";
    // 调用db.query() 执行 SQL 语句
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: "获取文章分类数据成功!",
            data: results,
        });
    });
};

// h获取文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 1. 定义查重的 SQL 语句
    const sql = `select * from ev_article_cate where name=? or alias=?`;
    // 2. 执行查重的 SQL 语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 3. 判断是否执行 SQL 语句失败
        if (err) return res.cc(err);

        // 4.1 判断数据的 length
        if (results.length === 2)
            return res.cc("分类名称与分类别名被占用，请更换后重试！");
        // 4.2 length 等于 1 的三种情况
        if (
            results.length === 1 &&
            results[0].name === req.body.name &&
            results[0].alias === req.body.alias
        )
            return res.cc("分类名称与分类别名被占用，请更换后重试！");
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc("分类名称被占用，请更换后重试！");
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc("分类别名被占用，请更换后重试！");

        // 定义插入文章分类的 SQL 语句
        const sql = `insert into ev_article_cate set ?`;
        // 执行插入文章分类的 SQL 语句
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("新增文章分类失败！");
            res.cc("新增文章分类成功！", 0);
        });
    });
};

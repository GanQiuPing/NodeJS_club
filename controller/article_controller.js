// 用变量接收，根据个人写法
var controller = module.exports;

// 引入 querystring模块
var querystring = require('querystring');

/**
 * 注意： 这里不能直接引入 article_model,因为model内容只是定义了数据结构，并没有初始化，没有增删改查能力
 * mongoose必须连接mongodb数据库， mongoose初始化是index_model负责
 * 通过引入 index_model来获取 articleModel对象
 */
var articleModel = require('../model/index_model.js').Article;

// 引入errHandle 错误信息文件
var errHandle = require('../errHandle.js');

// 显示添加文章页面
controller.showArticleAdd = function (req, res) {
    // 调用 express自带render方法
    res.render('article/articleAdd.html',{
         // 把cookie将入模板，目的：判断用户是否拥有该权限操作编辑按钮
        user: req.session.checkLogin
    });

}

// 添加文章
controller.doArticleAdd = function (req, res) {

    /**
     * 1. 获取表单提交数据
     * 2. 把数据保存到数据库中
     * 3. 返回响应数据
     */
    /**
     * 获取post提交数据
     * 由于post的数据量大，服务端并不是一次就可以获取到所有数据，而是以数据包请求，会发多次，取决数据大小
     * 这个方法会在每一次接收到post数据时才会调用 ，回调函数中参数就是本次数据块
     */

    //调用 中间件   app.js要引入，不要忘记了
    var body = req.bodyParse;
    console.log(body);

    // 创建一个实体
    var articleEntity = new articleModel({
        title: body.title,
        content: body.content,
        articleType: body.articleType,
        user_id: body.user_id // 该文章所属用户id,目的： 用来记录每个用户发表对应评论
    });

    console.log(articleEntity);

    // 添加到数据库中
    articleModel.create(articleEntity, function (err, docs) {
        // 如果添加失败，响应返回错误信息
        if (err) {
            // express 自带了json对象 ，内容帮我们转化好的 
            res.json(errHandle(500, err));
        }
        // 响应添加成功
        res.json(errHandle(0));
    })



/****************未使用中间件获取post请求参数的代码************************************* */
    //定义一个空的字符串变量 ，自己拼接
    /**var reqData = '';
    // 给 req 对象注册一个获取数据事件
    req.on('data', function (chunk) {
        // 默认读取是二进制 如果是拼接字符串， 会自动转换为字符串 toString()
        reqData += chunk;
    });
    // 当post请求执行后，会执行 req的 end事件
    req.on('end', function () {
        console.log('post请求数据接收完毕' + reqData);

        // 把获取参数转换为中文
        reqData = decodeURI(reqData);
        // 使用 querystring.parse()来解析请求参数
        var para = querystring.parse(reqData);

        //创建一个实体  
        var articleEntity = new articleModel({
            title: para.title,
            content: para.content,
            articleType: para.articleType
        });
        // console.dir(articleEntity);

        //添加文章到数据库   调用 mongoose中的 create方法
        articleModel.create(articleEntity, function (err) {
            // 如果添加失败  响应返回
            if (err) {
                // express自带了一个 json对象 ，内部帮我们转换好的
                res.json({
                    err_code: 500,
                    err_message: err.message
                });
            }
            //    添加成功响应返回
            res.json({
                err_code: 0,
                err_message: null
            });
        });
    });
*/
}
// 显示文章信息
controller.showArticleInfo = function (req, res) {
    /**
     * 思路：
     * 1. 用户点击标题，跳转详情页面
     * 服务器：2. 获取get请求参数id，根据id查询数据
     * 3. 访问量+1，更新数据库
     * 4. 返回响应结果，跳转首页
     */
    // get请求，express自动帮我们解析参数，得到一个query对象
    var query = req.query;
    // console.log(query);

    // 获取get请求参数id，根据id查询数据
    //注意：mongodb中的id是有下划线的，如果是只读取它，下划线可以省略，如果要修改值不能省略下划线
    articleModel.findById(query.id, function (err, docs) {
        // 如果没有这个id，查看文章失败
        if (err) {
            res.json(errHandle(500, err));
        }
        console.log('查看文章成功');

        // 每浏览一次 点击量+1
        var visitis = docs.visitis;
        visitis += 1;

        // 更新数据库
        articleModel.update({
            _id: query.id
        }, {
            visitis: visitis
        }, function (err,doc) {
            // 文章查看失败
            if (err) {
                res.json(errHandle(500, err));
            }
            // 系统维护中
            if(doc.length === 0){
                res.json(errHandle(9999));
            }

            // 渲染模板文件
            res.render('article/articleInfo.html', {
                article: docs,
                // 查看文章时返回用户session，用户html模板判断该用户是否拥有编辑权限
                user: req.session.checkLogin
            });
            console.log('8888888888888888888888888888888888888');
            console.log(docs);
        });
    });

}

// 显示编辑文章页面
controller.showArticleEdit = function (req, res) {
    /**
     * 思路：
     * 1. 点击编辑按钮，跳转到编辑页面：把当前文章的id传值 
     * 2. 服务器获取get请求参数，根据id查询
     * 3. 返回响应查询结果
     */
    console.log(req.query); // 获取 get 请求参数

    //取 get请求参数，可以使用 express 中的req.query获取
    var query = req.query;
    // console.log(query);

    // 根据id查询数据显示
    articleModel.findById(query.id, function (err, docs) {
        // 显示编辑页面失败
        // console.log(docs);
        if (err) {
            res.json(errHandle(500, err));
        }
        return res.render('article/articleEdit.html', {
            article: docs
        });
        
    });

}

// 编辑文章
controller.doArticleEdit = function (req, res) {
    /**
     * 服务端： 
     * 1. 获取用户提交数据
     * 2. 修改并保存数据到数据库
     * 3. 返回响应结果
     */
    // 使用body-parse中间件后，如果是post提交 ，服务端可以使用req.body获取一个req对象
    var body = req.bodyParse;
    console.log(body); //获取表单数据

    // 调用 mongoose中的 update方法
    /**
     * 注意:  
     * update(第一个参数：条件 第二个参数：要更新数据  第三个参数： 回调函数)
     */
    articleModel.update({_id: body.id},body,function(err,docs){
        // 如果修改失败，返回错误信息
        if(err){
            console.log('编辑失败：'+ JSON.stringify(docs));
            res.json(errHandle(500,err));
        }else{
            console.log('编辑成功：'+ JSON.stringify(docs));
            res.json(errHandle(0));
        }
    });

}
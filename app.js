// 项目入口程序

// 导入 express模块
var express = require('express');

//导入 path路径模块
var path = require('path');

// 引入 读取文件
var fs = require('fs');


// 创建服务器
var app = express();

/**
 * 2.  使用模板引擎，第一个参数： 模板文件名的后缀名，
 * 如果这里写 a,那么模板文件后缀名也要改为 a，一一对应
 */
// app.set('views', path.join(__dirname, './views'));  //默认会读取views文件夹，可以不用写
app.engine('html', require('express-art-template'));
//注册模板引擎 这里的 html要跟 上面的一一对应，否则找不到文件
app.set('view engine ', 'html');

/**
 * 3.  托管/挂载静态资源
 * express.static() ，参数是要托管的文件目录路径
 * 原理 ：自动帮我们判断路径，如果是我们路径前缀的请求会自动帮我们返回对应的静态资源
 */
//第一个参数：对应的虚拟目录（如果真的文件路径是node_modules/jquery/dist/jquery.min.js）
// 客户端也要写成：/a/jquery/dist/jquery.min.js 格式
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


// 解析挂载post请求的中间件
/**
 *  官方有提供 post请求中间件  ，具体使用参考文档
 * 导入body-parser 一旦挂载时我们所有req就会有一个属性 req.body可以获取post请求参数
 * 细节： body-parser 只能解析 普通文本数据，如果是文件还是需要formidable
 */

// 添加 自定义解析post请求中间件，并使用
var bodyParse = require('./body_parse.js');
app.use(bodyParse);

// 挂载网站图标的中间件
var favicon = require('serve-favicon')
// 参数是网站图标路径
app.use(favicon(path.join(__dirname, 'public', 'img' ,'hmclub.ico')))

// 挂载cookie-session 中间件
var cookieSession = require('cookie-session');
// 使用中间件
app.use(cookieSession({
    name:'sessionId',
    keys:['login'],
    // 设置cookie 有效期为  24小时
    maxAge: 24 * 60 * 60 * 1000
}));

// 查看请求路径中间件
app.use(function(req,res,next){
    console.log('请求路径：'+req.url);
    // 如果是get请求，express自带一个req对象有一个属性 req.query，获取get参数
    // console.log(req.query);
    // 如果是post请求，使用body-parser中间件后， express自带个 req对象有一个属性 req.body，获取post参数

    // 流向下一个中间件
    next();
});

//测试服务器是否畅通 (搭建基本框架)
/**app.get('/', function (req, res) {
    // 读取文件
    if (req.url === '/') {
        fs.readFile('./views/index.html', 'UTF-8', function (err, data) {
            if (err) {
                console.log('失败');
                throw err;
            }
            console.log('成功');
            // 返回响应数据
            res.end(data);
        });
    }
})*/


// 5. 路由容器
app.use(require('./router/index_router.js'));
app.use(require('./router/article_router.js'));
app.use(require('./router/user_router.js'));


//5. 监听端口号
app.listen(9090, function () {
    console.log('欢迎加入爱学习俱乐部');
});
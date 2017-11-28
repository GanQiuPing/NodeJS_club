//引入 querystring 模块
var querystring = require('querystring');

// 中间件 有三个参数 
module.exports = function (req, res, next) {
    // console.log(req.url);

    // 当post请求执行后，会执行 req的 end事件
    if (req.method === 'POST') {

        /**
         * 获取post提交数据
         * 由于post的数据量大，服务端并不是一次就可以获取到所有数据，而是以数据包请求，会发多次，取决数据大小
         * 这个方法会在每一次接收到post数据时才会调用 ，回调函数中参数就是本次数据块
         */

        //定义一个空的字符串变量 ，自己拼接
        var reqData = '';
        // 给 req 对象注册一个获取数据事件
        req.on('data', function (chunk) {
            // 默认读取是二进制 如果是拼接字符串， 会自动转换为字符串 toString()
            reqData+=chunk;
        });

        //当post请求执行后，会执行 req的 end事件
        req.on('end', function () {
            console.log('post请求数据接收完毕' + reqData);
            // 把获取参数转换为中文
            reqData = decodeURI(reqData);

            // 使用 querystring.parse()来解析请求参数
            req.bodyParse = querystring.parse(reqData);
            // console.dir(req.bodyParse);

            // 一旦加载了该中间件，如果是post请求直接通过req.bodyParse获取请求参数，
            // 如果不是post,req.bodyParse则为空，继续匹配后面的中间件
            next();
        });
    } else {
        // 如果是get则不获取直接匹配下一个中间件
        next();
    }
}
// 用变量接收，根据个人写法
var controller = module.exports;

// 引入 moment模块
var moment = require('moment');
// 默认是英文，如果要支持中文要设置国际化
moment.locale('zh-cn');

// 引入index_model文件
var indexModel = require('../model/index_model.js');

// 引入errHandle 错误信息文件
var errHandle = require('../errHandle.js');

// 显示首页
controller.showIndex = function (req, res) {
    /**
     * 配置模板引擎后，所有res对象都有一个render函数，
     * 第一个参数： 模板文件名（views文件夹下） 
     * 第二个参数：要渲染json对象  ，如果不传则直接返回模板文本
     */
    // res.render('index.html');
    /**
     * 1. 读取数据库数据
     * 2. 使用模板引擎渲染
     * 3. 返回响应数据
     */

    // 获取页数据（默认第一页）
    var page = (req.query.page && parseInt(req.query.page)) || 1;

    // 查询数据库文章集合所有数据
    indexModel.Article.count(function(err,count){ // 查询集合数量
        indexModel.Article.find() // 查询数据库所有数据
        .skip((page-1)* 5) //跳过多少条数据
        .limit(5) //查询数量限制
        .sort('-updatedAt') // 排序， +-表示升序和降序
        .exec(function(err, docs){ //exec表示执行查询请求,(当前链式语法设置查询参数才需要使用exec方法)
            // console.log('查询所有文章'+ docs);

            // forEach遍历所有文章，设置时间格式
            /**
             * 时间： 由于数据库默认时间是UTC时间，这里不能直接渲染，需要将时间转换后再渲染
             * getTime()函数作用： 将一个时间格式字符串转为时间戳，单位是毫秒 ，1970-1-1 0点
             * moment插件： 将一个时间戳转而moment格式时间
             */
            docs.forEach(function(item){
                // console.log('item:'+ item);
                // moment时间格式
                // console.log('时间：'+ item.updatedAt.getTime());
                // 这里相当于动态的给数据库中的对象添加一个时间属性，该lastUpdateTime属性只用于模板渲染显示
                item.lastUpdateTime = moment(item.updatedAt.getTime()).startOf('second').fromNow();
            });

            // 获取总分页数量  余数应该+1 ,  总页数 = 总数量 / 每页显示数量
            var pageCount = Math.ceil(count / 5);

            // 将模板引擎渲染好的数据返回浏览器客户端
            res.render('index.html',{
                article: docs,
                user: req.session.checkLogin,
                pageCount: pageCount,
                page: page
            });
        })
    });


/** *****************显示首页方法（未分页）******************************* */
    //  调用 express中的 查询方法
    // indexModel.Article.find(function (err, docs) {
    //     // console.dir(docs);
    //     //判断失败时返回
    //     if (err) {
    //         res.json((errHandle(500,err)));
    //     }
    //     /**
    //      * 时间： 由于数据库默认时间是UTC时间，这里不能直接渲染，需要将时间转换后再渲染
    //      * getTime()函数作用： 将一个时间格式字符串转为时间戳，单位是毫秒 ，1970-1-1 0点
    //      * moment插件： 将一个时间戳转而moment格式时间
    //      */

    //     docs.forEach(function (item) {
    //         // getTime()函数作用： 将一个时间格式字符串转为时间戳，单位是毫秒 ，1970-1-1 0点
    //         // console.log(item.updatedAt.getTime());
    //         // 转换为 moment时间格式
    //         // console.log(moment(item.updatedAt.getTime()));
    //         // 这里相当于动态的给数据库中的对象添加一个时间属性，该属性只用于模板渲染显示
    //         item.lastUpdateTime = moment(item.updatedAt.getTime()).startOf('second').fromNow();
    //     });

    //     // console.log('查询所有文章：'+ docs);

    //     //   渲染首页
    //     res.render('index.html', {
    //         // key模板占位对象 ，value：渲染数据
    //         article: docs,
    //         // 把cookie将入模板，目的：判断不同状态显示不一样的界面（没有登录，显示登录 注册按钮）
    //         user: req.session.checkLogin  
    //     });
    // });


}



// 显示搜索
controller.doSearchIndex = function (req, res) {
    /**
     * 服务端： 思路 
     * 1. 获取搜索文本参数
     * 2. 查询数据库，重新渲染查询到数据库首页模板
     * 3. 匹配搜索到相关内容， 服务返回查询结果
     * 注意： 如果是服务器渲染，由于界面被重新渲染所以搜索文本也会被丢失，
     * 需要服务器将搜索文本一并返回
     * 4. 浏览器接收结果
     */
    //获取get请求参数 searchStr
    var searchStr = req.query.searchStr;
    console.log('搜索字符：'+searchStr);
    // 用正则匹配，忽略大小写
    var reg = new RegExp(searchStr,'i');
    console.log('正则:'+ reg);
    // 查询数据，调用mongoose中查询方法 
    indexModel.Article.find({title: reg},function(err,docs){
        console.log('所有数据'+ docs);
        // 判断搜索失败
       if(err){
           res.json(errHandle(500));
       }else{
        //搜索的时候我们再使用模板引擎渲染时候，
        // 需要将用户提交搜索字符串也要渲染在模板中，否则搜索框文本会清空
        res.render('index.html',{
            article: docs,
            user: req.session.checkLogin,
            searchStr: searchStr // 在模板中渲染
        });
       }
    });
}


// 显示分页
controller.doPageIndex = function (req, res) {
    // 调用查询所有数据方法
    controller.showIndex(req, res);
}

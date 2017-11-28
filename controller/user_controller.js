// 根据个人写法，用变量接收
var controller = module.exports;

// 引入 index_controller 文件
var userModel = require('../model/index_model.js').User;

// 引入处理错误信息提示
var errHandle = require('../errHandle.js');

// 引入 index_controller控制器,目的： 退出功能调用 查询方法
var indexController = require('./index_controller.js');



// 显示注册页面
controller.showRegister = function(req, res) {
    res.render('register.html');
}

//注册功能
controller.doRegister = function(req, res) {
    /**
     * 思路：
     * 1. 获取post表单提交数据
     * 2. 查询数据库，如果注册成功，跳转到登录页面
     * 3. 判断邮箱是否存在，如果存在提示邮箱已存在，下一步
     * 4. 返回响应结果数据
     */
    // 获取 post提交表单数据   express中有自带获取post请求方法,req.body;
    var body = req.bodyParse;
    console.log(body);

    // 根据邮箱 查询数据
    userModel.find({email:body.email},function(err,docs){
       // 如果 docs(是一个数组)长度等于0 ，注册用户
       if(docs.length == 0){
            // 数据库没有该邮箱 ，则添加到数据库
            userModel.create(body,function(err){
                // 注册失败
                if(err){
                    console.log('注册失败');
                    res.json(errHandle(500,err));
                }else{
                    // 注册成功
                    console.log('注册成功');
                    res.json(errHandle(2000));
                }
            });
       }else{
           // 该邮箱存在了，返回错误信息
           res.json(errHandle(2001));
       }
    })

}


// 显示登录页面
controller.showLogin = function(req, res){
    res.render('login.html');
}

// 登录功能
controller.doLogin = function(req, res){
    /**
     * 思路：
     * 1. 获取post请求表单提交数据,判断服务器是否失败
     * 2. 判断输入邮箱和密码是否正确，  查询数据库
     * 3. 如果邮箱不正确，则提示： 用户名或密码有误
     * 4. 如果密码不正确，则提示： 用户名或密码有误
     * 3. 如果正确，登录成功，开启cookie保存当前用户，并跳转主页
     * 4. 返回响应结果
     */
    
    //  express中 自带获取post请求参数 使用req.body,得到req对象
    var body = req.bodyParse;
    console.log('我是登录功里面的body');
    // console.log(body);
    userModel.find({email:body.email},function(err,docs){
        // console.log(docs);
        // 判断服务器失败
        if(err){
            res.json(errHandle(500,err));
        }else{
            // 判断docs(数组长度是否为空)
            if(docs.length == 0){
                // 判断用户名或密码错误 
                res.json(errHandle(1001));
            }else {
                // 如果密码正确，登录成功
                if(body.password === docs[0].password){
                    //登录成功后， 把当前用户存入cookie中
                    /**
                     * 如果配置了cookie-sesstion中间件，req有一个属性session,他是一个json对象
                     * 用什么值存就用什么值取
                     */
                    req.session.checkLogin = docs[0];
                    // 成功返回状态码
                    res.json(errHandle(1000));

                }else{
                    // 判断输入密码跟数据库密码是否一致，不正确则提示
                    res.json(errHandle(1001));
                }
            }
        }
    })
}


// 退出功能
controller.doLoginout = function(req, res) {
    //清空cookie
    req.session.checkLogin = null;
    // 服务端刷新首页，等同于客户端： window.location.href = '/';
    indexController.showIndex(req, res);
}
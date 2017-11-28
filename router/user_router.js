// 引入 express 
var express = require('express');

// 引入controller 控制器
var controller = require('../controller/user_controller.js');

//创建路由容器
//router相当于服务器入口i文件的app的一个副本（mini-app）
var router = express.Router();

//分发控制路由  分发给 C层
router
.get('/login',controller.showLogin)
.post('/login',controller.doLogin)
.get('/register',controller.showRegister)
.post('/register',controller.doRegister)
.get('/loginout',controller.doLoginout);
;


// 导出路由
module.exports = router;
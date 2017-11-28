// 引入 express模块
var express = require('express');

//导入 controller控制器
var controller = require('../controller/index_controller.js');

// 创建路由容器
//router相当于服务器入口i文件的app的一个副本（mini-app）
var router = express.Router();

// 分发控制路由  分发给C层
router
.get('/',controller.showIndex) // 显示首页
.get('/indexPage',controller.doPageIndex)// 分页
.get('/indexSearch',controller.doSearchIndex) // 搜索
;


// 导出
module.exports = router;
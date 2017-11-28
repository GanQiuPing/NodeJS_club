// 引入 express模块
var express = require('express');

//引入文章控制器
var controller = require('../controller/article_controller.js');

// 创建路由容器
//router相当于服务器入口i文件的app的一个副本（mini-app）
var router = express.Router();

// 分发控制路由  分发给C层
router
.get('/article/add',controller.showArticleAdd) //显示添加文章页面
.post('/article/add',controller.doArticleAdd)  // 添加文章
.get('/acticle/info',controller.showArticleInfo)// 显示文章信息
.get('/acticle/edit',controller.showArticleEdit) //显示编辑文章页面
.post('/acticle/edit',controller.doArticleEdit) // 编辑文章
;

// 导出路由
module.exports = router;
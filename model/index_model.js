// index model： 展示页面内容

// 引入 article_model文件
// var articleModel = require('./article_model.js');
// 引入 user_model文件
// var userModel = require('./user_model.js');


// 导入 mongoose 模块
var mongoose = require('mongoose');

// 创建服务器
mongoose.connect('mongodb://127.0.0.1/hmClub');

/**
 * 导出
 * 首页不是一个独立的模型，而是其他模型的载体（数据来自多个模型中）
 */
module.exports = {
    Article: require('./article_model.js'),
    User: require('./user_model.js')
}
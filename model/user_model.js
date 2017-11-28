// 用户model： 处理数据 增删改查

// 导入 mongoose 模块
var mongoose = require('mongoose');

// 用户数据结构  Schema
/**
 * email: 邮箱,不能为空  ,正则在服务端验证，这里不验证了
 * password: 密码 不能为空
 * nickname: 昵称
 *  avatar: 头像
 * 时间： mongoose自动管理时间
 */
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default_icon.png'
    }
});

/**
 * 导出user 模型
 * 注意：
 * 1. 这个文章model处理数据增删改查
 * 2.mongoose中的Schema没有处理数据增删改查能力,  Schema作用：创建model
 * 3. 需要导出 model 
 */
module.exports = mongoose.model('User', userSchema);
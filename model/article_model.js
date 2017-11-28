// 文章model: 处理数据 增删改查

//  导入 mongoose
var mongoose = require ('mongoose');

//Schema数据结构
/**
 * 文章数据库结构：
 * title: 标题 ，不能为空
 * content: 内容 ，不能为空
 * articleType: 文章类型 (文章，回答。。。)
 * 时间： mongoose自动管理时间
 * visitis: 文章访问量 ， 默认为0
 */
var articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    articleType: {
        type: String
    },
    visitis: {
        type: Number,
        default: 0
    },
    user_id: {
        type: String,
        required: true // 文章作者id ,不能为空
    }
},{
    timestamps: true  // mongoose自动管理时间
});

// 导出 文章model
/**
 * 注意：
 * 1. 这个文章model处理数据增删改查
 * 2.mongoose中的Schema没有处理数据增删改查能力,Schema作用：创建model
 * 3. 需要导出 model 
 */
module.exports = mongoose.model('Article',articleSchema);
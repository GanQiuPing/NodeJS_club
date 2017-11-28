// 作用： 用来处理错误信息提示，将内容报错作为单独的一个模块，减少冗余代码 ，利于维护

/**
 * 0: 请求成功
 * 500： 请求失败
 * 1000： 登录成功
 * 1001： 用户名或密码错误
 * 2000： 注册成功
 * 2001： 邮箱已注册
 * 9999： 服务器维护中
 */

/**
 * 没有单独处理模块时，是这样写的
 * express自带 res.json({})直接返回一个对象, ;
 * if(err){
 *  res.json({
 *     err_code: 500,
 *     err_message: message
 * })
 * }
 */

/**
 * 现在调用时只需： 
 * if(err){
 *  res.json(errHandle.err_code(500))
 * }
 */




var errData; // 定义返回的错误码数据
var message; //  定义错误码

//导出模块
module.exports = function (code, err) {
    console.log(code);

    switch (code) {
        case 0:
            message = '请求成功'
            break;
        case 500:
            message = '请求失败'
            break;
        case 1000:
            message = '登录成功'
            break;
        case 1001:
            message = '用户名或密码不正确'
            break;
        case 2000:
            message = '注册成功'
            break;
        case 2001:
            message = '邮箱已存在，请重新填写'
            break;
        case 9999:
            message = '服务器维护中'
            break;
        default:
            message = '未知错误'
            break;
    }
    // 返回格式对象
    errData = {
        err_code: code,
        err_message: message
    }

    console.log(errData);
    return errData;
}
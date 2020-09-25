const Koa = require('koa')
const router = require('koa-router')
const bodypaser = require('koa-bodyparser')
const static = require('koa-static')
const session = require('koa-session')
const convert = require('koa-convert');
const CSRF = require('koa-csrf');

const app = new Koa()
var port = 3000

app.use(bodypaser())
app.use(static(__dirname + "/root"))

app.keys = ['some secret hurr']; // Session配置
const CONFIG = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: true,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
 };
app.use(session(CONFIG, app));

// add the CSRF middleware
app.use(new CSRF({
    // 使 koa 抛出的错误信息内容，默认值为：'Invalid CSRF token'。
    // 它可以是一个接收 ctx 作为参数的函数，函数最后返回错误信息内容。
    invalidTokenMessage: 'Invalid CSRF token',
    // 验证失败时的响应状态码，默认值为：403（Forbidden）。
    // 跟 invalidTokenMessage 参数一样，它也会被传递给 ctx.throw，用于抛出错误和拒绝请求。
    invalidTokenStatusCode: 403,
    // 排除的请求方法，默认值为：['GET', 'HEAD', 'OPTIONS']。
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    // 是否禁止通过查询字符串传递 _csrf 校验 token，默认值为 false。
    // 如果校验 token 出现在 URL 中，则可能会通过 Referer 泄露，应尽量把 Token 放在表单中，把敏感操作由 GET 改为 POST。
    disableQuery: false
}));

app.use(async (ctx, next) => { // 处理跨域
    ctx.set("Access-Control-Allow-Origin", "*")
    await next()
})
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200; 
    } else {
      await next();
    }
});

// 请求数据的接口
router.get('/getData', async (ctx, next) => {
    ctx.body = "getData";
})

app.use(router.routes())

app.use(router.allowedMethods())

app.listen(port, function(){
    console.log("start success! port : " + port);
})
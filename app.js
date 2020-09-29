const Koa = require('koa') // koa
const koastatic = require('koa-static') // 静态资源中间件
const cors = require('koa2-cors') // 跨域中间件
const koaBody = require('koa-body') // Post与文件上传 中间件
const Router = require('koa-router') // Get中间件
const helmet = require("koa-helmet") // koa安全中间件

const app = new Koa();
const router = new Router();
const port = 3000;

app.use(koastatic(__dirname + '/root')); // 配置静态资源路径
app.use(cors()); // 配置跨域
app.use(koaBody({  // Post中间件 同时支持文件上传
    multipart: true,
    formidable: {
        maxFileSize: 100*1024*1024    // 设置上传文件大小最大限制，默认20M 字节为单位
    }
}));
app.use(helmet());

const user_auth = require('./src/auths/user_auth.js') // 自定义过滤登陆用户中间件
var api = require('./src/routes/api.js');

app.use(user_auth());
router.use('/api', api);

app.use(router.routes()); // 启动路由
app.use(router.allowedMethods()); //请求错误状态码

app.listen(port, () => {
    console.log('start success! port:' + port);
});
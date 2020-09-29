var router = require('koa-router')();

router.post('/login', async (ctx)=>{
    var req = ctx.request;
    ctx.body = "success";
})

module.exports = router.routes();

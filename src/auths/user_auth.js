async function findUser(token){
    return new Promise(function(resolve){
        var user = undefined; // TODO find User
        resolve(user);
    });
}
const allowpage =[ // 忽略的页面
    '/api/user/login',
    '/api/user/signup',
]

module.exports = ()=>{
    return async function (ctx,next){
        if(allowpage.indexOf(ctx.path) > -1){
            //console.log('忽略的页面:' + ctx.path);
            await next();
            return;
        }else{
            var token = ctx.request.headers['token']; // 获取请求头时必须小写
            if(token){
                var user = await findUser(token);
                if(user){
                    ctx.request.userinfo = user;
                    await next();
                    return;
                }else{
                    //ctx.status = 401;
                    ctx.body = {
                        result:'-1',
                        msg:'The token expired' // 令牌失效
                    }
                }
            }else{
                //ctx.status = 401;
                ctx.body = {
                    result:'-1',
                    msg:'User not logged in' // 用户未登陆
                }
            }
        }
    }
}


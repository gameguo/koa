var router = require('koa-router')();
var user_api = require('./user.js');

router.use('/user',user_api);

module.exports = router.routes();

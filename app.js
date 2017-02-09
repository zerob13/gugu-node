import koa from "koa";
import http from "http";
import Router from "koa-router";
import bodyPaser from "koa-bodyparser";
import config from './config';
import {bindUser, printPaper} from './api';
import uuid from 'uuid/v4';
import moment from 'moment';
let userID = '';
let router = new Router();
function getNowTime() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}
router.post('/slack', async(ctx, next) => {
  await next();
  console.dir(ctx.request.body);
  let content = ctx.request.body.user_name + ' says: ' + ctx.request.body.text.replace(ctx.request.body.trigger_word, '');
  let result = await printPaper(config.ak, getNowTime(), content, 'T', config.deviceId, userID);
  ctx.body = {'text': 'print result: ' + result.showapi_res_error};
});

let app = new koa();

app.use(bodyPaser());

app.use(async(ctx, next) => {
  try {
    if (ctx.path === '/favicon.ico') return;
    await next();
  } catch (err) {
    ctx.body = {
      message: err.message
    };
    ctx.status = err.status || 500;
  }
});

app.use(router.routes())
  .use(router.allowedMethods());

app.use(async(ctx) => {
  ctx.body = 'hello world !';
});

const port = process.env.NODE_PORT;
let server = http.createServer(app.callback());
bindUser(config.ak, getNowTime(), config.deviceId, uuid()).then((res) => {
    if (res.showapi_res_code == 1) {
      userID = res.showapi_userid;
      server.listen(port, () => {
        console.log('gugu server on ' + port);
        console.log(userID);
      });
    }
  }
);



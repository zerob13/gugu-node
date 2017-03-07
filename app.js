import koa from "koa";
import http from "http";
import Router from "koa-router";
import bodyPaser from "koa-bodyparser";
import config from "./config";
import {bindUser, printPaper} from "./api";
import uuid from "uuid/v4";
import moment from "moment";
import gm from "gm";
import request from "request";

let userID = '';
let router = new Router();
function getNowTime() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}
function checkToken(token) {
  let res = false
  config.tokens.forEach((item) => {
    if (token == item) {
      res = true;
      return;
    }
  });
  return res;
}
router.post('/slack', async(ctx, next) => {
  await next();
  if (!checkToken(ctx.request.body.token)) {
    if (!ctx.request.params || !ctx.request.params.noreply) {
      ctx.body = {'text': 'you are not allowd to use this server'};
    }
    return;
  }
  let content = ctx.request.body.user_name + ' says: ' + ctx.request.body.text;
  if (ctx.request.body.trigger_word == 'gu-_-pic') {
    let url = ctx.request.body.text.replace('gu-_-pic', '');
    console.log(url);
    gm(request(url))
      .resize(384)
      .modulate(130, 20, 100)
      .trim()
      .flip()
      .type('Grayscale')
      .colors(2)
      .toBuffer('bmp', (err, buffer) => {
        if (err) {
          console.log('failed');
          console.dir(err);
          return;
        }
        printPaper(config.ak, getNowTime(), buffer.toString('base64'), 'P', config.deviceId, userID).then(res => {
          console.dir(res);
        });
      });
    if (!ctx.request.params || !ctx.request.params.noreply) {
      ctx.body = {'text': 'print result: sent'};
    }
  } else {
    let result = await printPaper(config.ak, getNowTime(), content, 'T', config.deviceId, userID);
    if (!ctx.request.params || !ctx.request.params.noreply) {
      ctx.body = {'text': 'print result: ' + result.showapi_res_error};
    }
  }
});


router.post('/text', async(ctx, next) => {
  if (!checkToken(ctx.request.body.token)) {
    ctx.body = {'text': 'you are not allowd to use this server'};
    return;
  }
  let content = ctx.request.body.text;
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



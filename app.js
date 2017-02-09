import koa from "koa";
import http from "http";
import Router from "koa-router";
import bodyPaser from "koa-bodyparser";

let router = new Router();
router.post('/slack', async(ctx, next) => {
  await next();
  console.dir(ctx.request.body);
  ctx.body = {'text': 'printed!' + ctx.request.body.toString()};
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

server.listen(port, () => {
  console.log('gugu server on ' + port);
});


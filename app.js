import koa from 'koa';
import config from './config';
import http from 'http';
import Router from "koa-router";
import bodyPaser from 'koa-bodyparser';

let router = new Router();
router.post('/slack', async(ctx, next) => {
  await next();
  console.dir(ctx.request.body);
  ctx.body = {'text': 'printed!' + ctx.request.body.toString()};
});
let app = new koa();
app.use(bodyPaser());
app.use(router.routes())
  .use(router.allowedMethods());

const port = process.env.NODE_PORT;
let server = http.createServer(app.callback());
server.listen(port, () => {
  console.log('gugu server on ' + port);
});


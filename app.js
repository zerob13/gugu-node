import koa from 'koa';
import config from './config';
import http from 'http';

let app = new koa();
const port = process.env.NODE_PORT;
let server = http.createServer(app.callback());
server.listen(port, () => {
  console.log('gugu server on ' + port);
});


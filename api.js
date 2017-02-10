/**
 * Created by zerob13 on 2/9/17.
 */
import fetch from 'node-fetch';
import iconvLite from 'iconv-lite';

const END_POINT = 'http://open.memobird.cn/home';
const BIND_USER = '/setuserbind';
const PRINT_PAPER = '/printpaper';

export function bindUser(ak, timestamp, memobirdID, useridentifying) {
  let query = END_POINT + BIND_USER + '?ak=' + ak + '&timestamp=' + timestamp
    + '&memobirdID=' + memobirdID + '&useridentifying=' + useridentifying;
  return fetch(encodeURI(query))
    .then(res => res.json());
}

export function printPaper(ak, timestamp, printcontent, type, memobirdID, userID) {
  let content;
  if (type === 'T') {
    content = Buffer.from(iconvLite.encode(printcontent, 'gbk')).toString('base64');
  } else if (type === 'P') {
    content = printcontent;
  }
  let query = END_POINT + PRINT_PAPER;
  return fetch(query, {
    method: 'POST',
    body: JSON.stringify({
      'ak': ak, 'timestamp': timestamp,
      'printcontent': type + ':' + content,
      'memobirdID': memobirdID,
      'userID': userID
    }),
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => {
      let re = res.json();
      return re;
    });

}


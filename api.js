/**
 * Created by zerob13 on 2/9/17.
 */
import fetch from 'node-fetch';
import iconvLite from 'iconv-lite';

const END_POINT = 'http://open.memobird.cn/home';
const BIND_USER = '/setuserbind';
const PRINT_PAPER = '/printpaper';

export function bindUser(ak, timestamp, memobirdID, useridentifying) {
  return fetch(END_POINT + BIND_USER + '?ak=' + ak + '&timestamp=' + timestamp
    + '&memobirdID=' + memobirdID + '&useridentifying=' + useridentifying)
    .then(res => res.json());
}

export function printPaper(ak, timestamp, printcontent, type, memobirdID, userID) {
  let content;
  if (type === 'T') {
    content = Buffer.from(iconvLite.encode(printcontent, 'gbk')).toString('base64');
  } else if (type === 'P') {
    //TODO: convert image to base64
  }
  return fetch(END_POINT + BIND_USER + '?ak=' + ak + '&timestamp=' + timestamp
    + '&printcontent=' + type + ':' + content + '&memobirdID=' + memobirdID + '&userID=' + userID)
    .then(res => res.json());

}


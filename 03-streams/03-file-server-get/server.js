const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  if (isNestedFile(pathname)) {
    res.statusCode = 400;
    res.end('Nested paths are not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', () => {
        res.statusCode = 404;
        res.end('Not found');
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

/**
 * @param pathname {string}
 * @returns {boolean}
 */
function isNestedFile(pathname) {
  return pathname.includes('/');
}

module.exports = server;

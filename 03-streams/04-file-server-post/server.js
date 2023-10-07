const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (isNestedFile(pathname)) {
    res.statusCode = 400;
    res.end('Nested paths are not supported');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File exists. Aborted');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({limit: 1024 * 1024, encoding: 'utf-8'});
      const outStream = fs.createWriteStream(filepath);

      req.pipe(limitedStream).pipe(outStream);

      limitedStream.on('error', (err) => {
        fs.unlinkSync(filepath);
        req.resume();
        outStream.destroy();
        limitedStream.destroy();

        res.statusCode = 413;
        res.end(err.message);

      })

      req.on('aborted', () => {
        fs.unlinkSync(filepath);
        res.statusCode = 500;
        res.end('Server error');

        outStream.destroy();
        limitedStream.destroy();
      });

      req.on('end', () => {
        res.statusCode = 201;
        res.end('Saved');

        outStream.destroy();
        limitedStream.destroy();
      });

      req.on('error', () => {
        outStream.destroy();
        limitedStream.destroy();
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

const http = require('http');
const path = require('path');
const readFile = require('./readFile');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  switch (req.method) {
    case 'GET':
      readFile(filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

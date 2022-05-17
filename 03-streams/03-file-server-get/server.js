const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const isNestedPath = pathname.includes('/');

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);

  stream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      res.statusCode = isNestedPath ? 400 : 404;
      res.end('File was not found');
    } else {
      res.statusCode = 500;
      res.end('Something went wrong! Please, try again later');
    }
  });
  stream.on('open', () => console.log('open'));
  stream.on('close', () => console.log('close'));

  req.on('aborted', () => stream.destroy());

  switch (req.method) {
    case 'GET':
      stream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

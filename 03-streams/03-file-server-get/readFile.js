const fs = require('fs');

module.exports = (filepath, req, res) => {
  const stream = fs.createReadStream(filepath);

  stream.pipe(res);

  stream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File was not found');
    } else {
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  req.on('aborted', () => stream.destroy());
};

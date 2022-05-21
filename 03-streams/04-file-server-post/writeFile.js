const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

module.exports = (filepath, req, res) => {
  const dirPath = path.join(__dirname, 'files');

  if (!filepath) {
    res.statusCode = 404;
    res.end('Bad request');
    return;
  }
  if (req.headers['content-length'] > 1e6) {
    res.statusCode = 413;
    res.end('File size exceeded');
    return;
  }
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const sizeStream = new LimitSizeStream({limit: 1e6, encoding: 'utf-8'});
  const stream = fs.createWriteStream(filepath, {flags: 'wx'});

  req.pipe(sizeStream).pipe(stream);

  sizeStream.on('error', (error) => {
    if (error.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end('File size exceeded');
    } else {
      res.statusCode = 500;
      res.end('Internal server error');
    }
    fs.unlink(filepath, (error) => console.log(error));
  });

  stream.on('error', (error) => {
    if (error.code === 'EEXIST') {
      res.statusCode = 409;
      res.end('File is already exists');
    } else {
      res.statusCode = 500;
      res.end('Internal server error');
      fs.unlink(filepath, (error) => console.log(error));
    }
  });
  stream.on('finish', () => {
    res.statusCode = 201;
    res.end('File has been saved');
  });

  req.on('aborted', () => {
    fs.unlink(filepath, (error) => error && console.log(error));
    stream.destroy();
  });
};

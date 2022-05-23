const fs = require('fs');

module.exports = (filepath, req, res) => {
  if (!filepath) {
    res.statusCode = 404;
    res.end('Bad request');
    return;
  }

  const stream = fs.createReadStream(filepath);

  stream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File was not found');
    } else {
      res.statusCode = 500;
      res.end('Internal server error');
    }
    console.log(error.message);
  });

  stream.on('end', () => {
    fs.unlink(filepath, (error) => console.log(error));
    res.statusCode = 200;
    res.end('File succesfully removed');
  });

  stream.on('data', (chunk) => {});

  req.on('aborted', () => stream.destroy());
};

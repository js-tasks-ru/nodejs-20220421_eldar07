const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    try {
      this.line += chunk.toString();

      while (this.line.includes(os.EOL)) {
        this.line = this.line.split(os.EOL);
        const res = this.line.shift();
        this.push(res);
        this.line = this.line.join(os.EOL);
      }

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  _flush(callback) {
    callback(null, this.line);
  }
}

module.exports = LineSplitStream;

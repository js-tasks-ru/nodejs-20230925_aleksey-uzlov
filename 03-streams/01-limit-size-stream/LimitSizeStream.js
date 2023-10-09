const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  currentLimitInBytes = 0;

  get getTotalLimitInBytes() {
    return this._options.limit;
  }

  /**
   * @param options {limit: TransformOptions & {limit: number}}
   */
  constructor(options) {
    super(options);
    this._options = options;
  }

  /**
   * @param chunk {Buffer}
   * @param encoding
   * @param callback
   * @private
   */
  _transform(chunk, encoding, callback) {
    this.currentLimitInBytes += chunk.length;

    const isLimitExceeded = this.currentLimitInBytes > this.getTotalLimitInBytes;
    const error = isLimitExceeded ? new LimitExceededError() : null;

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;

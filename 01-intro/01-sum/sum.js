/**
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError(`Not a valid input: ${a}, ${b}`);
  }

  return a + b;
}

/**
 * @param n {number}
 * @returns {boolean}
 */
function isNumber(n) {
  return typeof n === 'number';
}

module.exports = sum;

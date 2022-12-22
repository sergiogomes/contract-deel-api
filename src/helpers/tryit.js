/**
 * @param {Promise} promise
 * @returns {Promise<[Error, null] | [null, any] | any[]>}
 */
const tryit = (promise) => promise
  .then((response) => [null, response])
  .catch((error) => [error, null])

module.exports = {tryit}

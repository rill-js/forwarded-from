'use strict'

var isLocal = require('is-local-ip')

/**
 * Creates a middleware that will update `ctx.req.ip` with valid `X-Forwarded-For`
 * headers from trusted ips.
 *
 * @param {Object} options
 * @param {String|Array<String>} [options.from] - A list of allowed ip addresses.
 * @param {Boolean} [options.local=true] - Allow local ip addresses.
 * @return {Function}
 */
module.exports = function forwardedFrom (options) {
  options = options || {}
  var ips = options.from && [].concat(options.from)
  var local = 'local' in options ? options.local : true

  return function forwardedFromMiddleware (ctx, next) {
    var req = ctx.req
    var forward = req.get('X-Forwarded-For')

    if (forward && (
      (ips && ips.indexOf(req.ip)) ||
      (local && isLocal(req.ip))
    )) {
      req.forwarded = true
      req.ip = forward
    }

    return next()
  }
}

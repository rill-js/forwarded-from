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
    var isAccepted = (ips && ips.indexOf(req.ip)) || (local && isLocal(req.ip))

    if (isAccepted) {
      // Check for forwareded ip address.
      var forwardIP = req.get('X-Forwarded-For')
      if (forwardIP) {
        req.ip = forwardIP
      }

      // Check for forwarded host.
      var forwardHost = req.get('X-Forwarded-Host')
      if (forwardHost) {
        // Parse the host into its parts.
        var parts = parseHost(forwardHost, req.port)
        req.host = parts.host
        req.hostname = parts.hostname
        req.port = parts.port
      }

      req.forwarded = true
    }

    return next()
  }
}

/**
 * Parses a host into host, hostname and port.
 *
 * @param {String} host
 * @param {Number} port
 */
function parseHost (host, port) {
  var result = { host: host }
  var index = host.indexOf(':')
  if (index) {
    result.hostname = host.slice(0, index)
    result.port = host.slice(index + 1)
  } else {
    result.hostname = host
    result.port = port
  }

  return result
}

'use strict'

var test = require('tape')
var agent = require('supertest').agent
var rill = require('rill')
var forwarded = require('../')
var fakeIP = '184.1.2.3'
var localIP = '::ffff:127.0.0.1'
var fakeHostname = 'test.com'
var fakePort = '3002'
var fakeHost = fakeHostname + ':' + fakePort

test('Listen for X-Forwarded-For header', function (t) {
  t.plan(7)

  var request = agent(rill()
    // Allow local by default.
    .get('/test-local', forwarded(), function (ctx) {
      t.equal(ctx.req.ip, fakeIP, 'Updated req.ip')
      t.equal(ctx.req.host, fakeHost, 'Updated req.host')
      t.equal(ctx.req.hostname, fakeHostname, 'Updated req.hostname')
      t.equal(ctx.req.port, fakePort, 'Updated req.port')
      t.equal(ctx.req.forwarded, true, 'Set request to forwared')
      ctx.res.status = 200
    })
    .get('/test-no-local', forwarded({ local: false }), function (ctx) {
      t.equal(ctx.req.ip, localIP, 'Didnt updated req.ip')
      t.equal(ctx.req.forwarded, undefined, 'Didnt set request to forwared')
      ctx.res.status = 200
    })
    .listen().unref())

  request
    .get('/test-local')
    .set('X-Forwarded-For', fakeIP)
    .set('X-Forwarded-Host', fakeHost)
    .expect(200)
    .then(function () {}, t.fail)

  request
    .get('/test-no-local')
    .set('X-Forwarded-For', fakeIP)
    .set('X-Forwarded-Host', fakeHost)
    .expect(200)
    .then(function () {}, t.fail)
})

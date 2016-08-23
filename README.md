<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/forwarded-from
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/forwarded-from">
    <img src="https://img.shields.io/npm/v/@rill/forwarded-from.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/forwarded-from">
    <img src="https://img.shields.io/npm/dm/@rill/forwarded-from.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

<div align="center">
  Safely handle the `X-Forwarded-For` header in <a href="https://gitter.im/rill-js/rill">Rill</a>.

  This middleware will update "ctx.req.ip" if a "X-Forwarded-For" header is present from a trusted ip.
</div>

# Installation

#### Npm
```console
npm install @rill/forwarded-from
```

# Example

#### app.js

```js
const app = rill()
const forwarded = require("@rill/forwarded-from")

// This will only trust X-Forwarded-For from incomming requests with the provided ips and any local requests.
app.use(forwarded({ from: ['184.1.2.3', '184.2.3.4'] }))

// Example request with `X-Forwarded-For` from valid ip.
app.get('/test', ({ req, res })=> {
  req.forwarded //-> true
  req.get('X-Forwarded-For') //-> 178.1.2.3
  req.ip //-> 178.1.2.3
})
```

# API

+ **forwarded({ from: String..., local: Boolean  })** : Creates a middleware that will update `ctx.req.ip` with a valid `X-Forwarded-For` header.

```javascript
// Without any options this will only allow `X-Forwarded-For` on local requests.
app.use(forwarded())

// Any ip's specified in the `from` option will also be valid.
app.use(forwarded({ from: '184.1.2.3' }))

// You can disable local ip's by setting `options.local=false` (default true).
app.use(forwarded({ from: '184.1.2.3', local: false }))
```

---

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!

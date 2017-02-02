# ulp

[![Build Status](https://travis-ci.org/jcoreio/ulp.svg?branch=master)](https://travis-ci.org/jcoreio/ulp)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/ulp/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/ulp?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Math.nextDown, Math.nextUp, Math.ulp in javascript (from https://gist.github.com/Yaffle/4654250)

## `nextUp(x: number): number`

Returns the smallest floating-point number greater than `x`.
**Denormalized values may not be supported.**

```js
var nextUp = require('ulp').nextUp
nextUp(1) // 1.0000000000000002
```

## `nextDown(x: number): number`

Returns the largest floating-point number less than `x`.
**Denormalized values may not be supported.**

```js
var nextDown = require('ulp').nextDown
nextDown(1) // 0.9999999999999999
```

## `ulp(x: number): number`

Returns the unit in the last place of `x`.
**Denormalized values may not be supported.**

```js
var ulp = require('ulp').ulp
ulp(1) // 1.1102230246251565e-16
```

## `monkeypatch(): void`

Monkeypatches `nextUp`, `nextDown`, and `ulp` onto `Math`.

```js
require('ulp').monkeypatch()
Math.nextUp(1) // 1.0000000000000002
Math.nextDown(1) // 0.9999999999999999
Math.ulp(1) // 1.1102230246251565e-16
```


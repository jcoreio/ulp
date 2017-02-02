'use strict'

var assert = require('chai').assert
var expect = require('chai').expect
var nextUp = require('../lib').nextUp
var nextDown = require('../lib').nextDown
var ulp = require('../lib').ulp
var monkeypatch = require('../lib').monkeypatch

// denormalized values may not be supported
// MIN_VALUE is 2.2250738585072014e-308, when should be 5e-324 on Opera Mobile

var EPSILON = Math.pow(2, -52)
var MAX_VALUE = (2 - EPSILON) * Math.pow(2, 1023)
var MIN_VALUE = Math.pow(2, -1022)

var special = [
  0 / 0,
  1 / 0,
  MAX_VALUE,
  1,
  MIN_VALUE,
  MIN_VALUE * EPSILON,
  0
]

function assertEquals(actual, expected) {
  var ok = (actual === expected && (actual !== 0 || 1 / actual === 1 / expected)) || (actual !== actual && expected !== expected)
  assert(ok, {actual: actual, expected: expected})
}

describe('nextUp', function () {
  it('works', function () {
    assertEquals(nextUp(+0 / 0), 0 / 0)
    assertEquals(nextUp(-0 / 0), 0 / 0)
    assertEquals(nextUp(+1 / 0), +1 / 0)
    assertEquals(nextUp(-1 / 0), -MAX_VALUE)
    assertEquals(nextUp(+MAX_VALUE), +1 / 0)
    assertEquals(nextUp(-MAX_VALUE), -1.7976931348623155e+308)
    assertEquals(nextUp(+1), +1 + EPSILON)
    assertEquals(nextUp(-1), -1 + EPSILON / 2)
    assertEquals(nextUp(+MIN_VALUE), +2.225073858507202e-308)
    assertEquals(nextUp(-MIN_VALUE), -2.225073858507201e-308)
    assertEquals(nextUp(+0), MIN_VALUE * EPSILON > 0 ? MIN_VALUE * EPSILON : MIN_VALUE)
    assertEquals(nextUp(-0), MIN_VALUE * EPSILON > 0 ? MIN_VALUE * EPSILON : MIN_VALUE)
    var i
    var j
    var value

    i = -1
    while (++i < special.length) {
      value = special[i]
      if (value !== +1 / 0) {
        j = -1
        while (++j < 2) {
          assertEquals(0 + nextUp(-nextUp(-value)), 0 + value)
          value = -value
        }
      }
    }

    if (typeof Float64Array !== 'undefined' && typeof Uint16Array !== 'undefined') {
      /* global Float64Array, Uint16Array */
      var float64Array = new Float64Array(1)
      var uint16Array = new Uint16Array(float64Array.buffer)

      var nextUp2 = function nextUp2(x) {
        if (x !== x) {
          return 0 / 0
        }
        if (x === +1 / 0) {
          return x
        }
        if (x === 0) {
          return MIN_VALUE * EPSILON > 0 ? MIN_VALUE * EPSILON : MIN_VALUE
        }
        float64Array[0] = x
        var n = x < 0 ? -1 : 1
        i = -1
        while (++i < 4) {
          n += uint16Array[i]
          uint16Array[i] = n & 0xffff
          n >>= 16
        }
        return float64Array[0]
      }

      var k = -1
      while (++k < special.length) {
        value = special[k]
        var l = -1
        while (++l < 2) {
          assertEquals(nextUp(value), nextUp2(value))
          value = -value
        }
      }

      var crypto = global.crypto || global.msCrypto
      if (crypto && crypto.getRandomValues) {
        var c = 0
        while (++c < 1024 * 16) {
          crypto.getRandomValues(uint16Array)
          var v = float64Array[0]
          assertEquals(nextUp(v), nextUp2(v))
        }
      }
    }
  })
})

describe('monkeypatch', function () {
  it('works', function () {
    expect(Math.nextUp).not.to.exist
    expect(Math.nextDown).not.to.exist
    expect(Math.ulp).not.to.exist
    monkeypatch()
    expect(Math.nextUp).to.equal(nextUp)
    expect(Math.nextDown).to.equal(nextDown)
    expect(Math.ulp).to.equal(ulp)
  })
})


/*global require:false*/

// dynamically load polyfills, and load the app when the required ones are loaded:

const NUM_POLYFILLS = 6 // update this number if adding polyfills

let num = 0
const loaded = () => {
  num++
  if (num === NUM_POLYFILLS) {
    require('./index')
  }
}

if (window.Promise) {
  loaded()
} else {
  require.ensure(['es6-promise'], (require) => {
    require('es6-promise').polyfill()
    loaded()
  })
}

if (window.fetch) {
  loaded()
} else {
  require.ensure(['whatwg-fetch'], (require) => {
    require('whatwg-fetch')
    loaded()
  })
}

if (window.Intl) {
  loaded()
} else {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/fr.js',
  ], (require) => {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    require('intl/locale-data/jsonp/fr.js')
    loaded()
  })
}

if (Array.prototype.find) {
  loaded()
} else {
  require.ensure(['array.prototype.find'], (require) => {
    require('array.prototype.find').shim()
    loaded()
  })
}

if (Array.prototype.includes) {
  loaded()
} else {
  require.ensure(['array-includes'], (require) => {
    require('array-includes').shim()
    loaded()
  })
}

if (String.prototype.startsWith) {
  loaded()
} else {
  require.ensure(['string.prototype.startswith'], (require) => {
    require('string.prototype.startswith')
    loaded()
  })
}

// static polyfills for the Web

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
}

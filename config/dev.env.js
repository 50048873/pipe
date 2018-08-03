'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const api_host = require('./api_host')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: api_host.dev
})

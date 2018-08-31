const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const _ = require('lodash')

const DEFAULT_CONFIG = yaml.safeLoad(
  fs.readFileSync(
    path.resolve(
      process.cwd(),
      'default.config.yml'
    )
  )
)

module.exports = {
  get: (p) => _.get(DEFAULT_CONFIG, p)
}

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

const ENV_CONFIG_PATH = process.env.CONFIG_PATH || path.resolve(
  process.cwd(),
  'env.config.yml'
)

let config = {}

function loadConfig () {
  try {
    config = _.merge(
      {},
      DEFAULT_CONFIG,
      yaml.safeLoad(
        fs.readFileSync(ENV_CONFIG_PATH)
      )
    )
  } catch (err) {
    config = DEFAULT_CONFIG
  }
}

loadConfig()

fs.watch(
  ENV_CONFIG_PATH,
  loadConfig
)

module.exports = {
  get: (p) => _.cloneDeep(
    _.get(config, p)
  )
}

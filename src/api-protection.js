const config = require('./config')
const logger = require('./loggers').get('api-protection')

module.exports = (req, res, next) => {
  if (config.get('apiProtection.enabled')) {
    logger.silly('API protection is on')
    const allowedHosts = config.get('apiProtection.allowedHosts')

    logger.verbose(`Checking host ${req.get('Host')}...`)
    if (allowedHosts.indexOf(req.get('Host')) < 0) {
      logger.info(`Host ${req.get('Host')} is not allowed to make requests`)
      res.sendStatus(401)

      return null
    }
  }

  logger.silly('API protection is off or successfully passed')
  return next()
}

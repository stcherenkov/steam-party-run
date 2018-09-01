const winston = require('winston')
const _ = require('lodash')
const { combine, colorize, align, timestamp, label, printf } = winston.format

const config = require('./config')

winston.addColors(winston.config.npm.colors)

const createLogger = (name) => winston.createLogger({
  level: config.get(['log', 'override', name]) || config.get('log.level'),
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console()
  ],
  format: combine(
    colorize(),
    label({
      label: name
    }),
    timestamp(),
    align(),
    printf((info) => {
      if (info instanceof Error) {
        return `${info.timestamp} ${info.level} :: [${info.label}] ${info.constructor.name}: ${info.message} \n${info.stack}`
      }

      return `${info.timestamp} ${info.level} :: [${info.label}] ${info.message}`
    })
  )
})

const namedLoggers = {}

const get = (name) => {
  if (!namedLoggers[name]) {
    namedLoggers[name] = createLogger(name)
  }

  return namedLoggers[name]
}

module.exports = {
  get,
  // simplified version of express-winston approach
  expressHTTP: (req, res, next) => {
    req.timestamp = Date.now()

    const logger = get('express')

    const origialEnd = res.end

    res.end = function (...args) {
      const responseTime = Date.now() - req.timestamp
      let level = 'http'

      if (res.statusCode >= 500) {
        level = 'error'
      } else if (res.statusCode >= 400) {
        level = 'warn'
      }

      logger.log({
        level,
        message: `${req.method} ${req.url} >> ${res.statusCode} ${responseTime}ms`
      })

      origialEnd.apply(this, args)
    }

    next()
  },
  // simplified version of express-winston approach
  expressError: (err, req, res, next) => {
    const logger = get('express')

    logger.error(err)

    next(err)
  }
}

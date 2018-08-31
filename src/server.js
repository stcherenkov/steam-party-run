const express = require('express')

const winston = require('winston')
const expressWinston = require('express-winston')

const config = require('./config')

const app = express()

// FIXME
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ],
  meta: true,
  msg: "{{req.method}} {{req.url}} >> {{res.statusCode}} {{res.responseTime}}ms",
  colorize: true
}))

// add router here

// FIXME
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ]
}))

app.listen(
  config.get('server.port')
)

console.log(`Server started on port ${config.get('server.port')}`)

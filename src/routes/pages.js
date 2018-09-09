const router = require('express').Router()

const config = require('../config')

router.get('/', (req, res) => {
  return res.render('index', {
    configJSON: JSON.stringify({
      apiRoot: `${config.get('server.context')}/api`
    })
  })
})

module.exports = router

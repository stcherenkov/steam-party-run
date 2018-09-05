const router = require('express').Router()

const steamspy = require('../proxies/steamspy')
const steam = require('../proxies/steam')

router.get('/game', async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('400 Bad request')
  }

  const found = await steamspy.getMultiplayerById(req.query.id)

  return res.send(found)
})

router.get('/user/all', async (req, res, next) => {
  if (!req.query.name && !req.query.id) {
    return res.sendStatus(400)
  }

  try {
    let gameIds
    if (req.query.id) {
      gameIds = await steam.getGameIdsByUserId(req.query.id)
    } else {
      gameIds = await steam.getGameIdsByUsername(req.query.name)
    }

    return res.send({ gameIds })
  } catch (err) {
    return next(err)
  }
})

router.get('/user/multiplayer', async (req, res, next) => {
  if (!req.query.name && !req.query.id) {
    return res.sendStatus(400)
  }

  try {
    let gameIds
    if (req.query.id) {
      gameIds = await steam.getGameIdsByUserId(req.query.id)
    } else {
      gameIds = await steam.getGameIdsByUsername(req.query.name)
    }

    const multiplayer = await steamspy.filterMultiplayer(gameIds)

    return res.send({ multiplayer })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

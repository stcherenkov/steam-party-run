const router = require('express').Router()

const steamspy = require('../proxies/steamspy')

router.get('/cached/game', async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('400 Bad request')
  }

  const found = await steamspy.getById(req.query.id)

  return res.send(found)
})

const steamUser = require('../proxies/steam')

router.get('/user/all', async (req, res, next) => {
  if (!req.query.name) {
    return res.status(400).send('400 Bad request')
  }

  try {
    const games = await steamUser.getUserGames(
      req.query.name,
      (a, b) => b.playtime_forever - a.playtime_forever
    )

    return res.send({ games })
  } catch (err) {
    return next(err)
  }
})

router.get('/user/multiplayer', async (req, res, next) => {
  if (!req.query.name) {
    return res.status(400).send('400 Bad request')
  }

  try {
    const gameIds = await steamUser.getUserGames(
      req.query.name,
      (a, b) => b.playtime_forever - a.playtime_forever
    )
    const multiplayer = await steamspy.filterMultiplayer(gameIds)

    return res.send(multiplayer)
  } catch (err) {
    return next(err)
  }
})

module.exports = router

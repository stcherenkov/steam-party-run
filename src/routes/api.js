const router = require('express').Router()

const steamspy = require('../proxies/steamspy')
const steam = require('../proxies/steam')

router.get('/user', async (req, res, next) => {
  if (!req.query.name && !req.query.id) {
    return res.sendStatus(400)
  }

  try {
    let user
    let games
    if (req.query.id) {
      user = await steam.getUserById(req.query.id)
      games = await steam.getGameIdsByUserId(req.query.id)
    } else {
      user = await steam.getUserByName(req.query.name)
      games = await steam.getGameIdsByUsername(req.query.name)
    }

    user.games = games

    return res.send({ user })
  } catch (err) {
    return next(err)
  }
})

router.get('/user/multiplayer', async (req, res, next) => {
  if (!req.query.name && !req.query.id) {
    return res.sendStatus(400)
  }

  try {
    let games
    if (req.query.id) {
      games = await steam.getGameIdsByUserId(req.query.id)
    } else {
      games = await steam.getGameIdsByUsername(req.query.name)
    }

    const multiplayer = await steamspy.filterMultiplayer(games)

    return res.send({ multiplayer })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

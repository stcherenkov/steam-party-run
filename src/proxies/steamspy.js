const _ = require('lodash')
const rq = require('request-promise')

const config = require('../config')
const logger = require('../loggers').get('steamspy')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(config.get('lowdb.games'))
const db = low(adapter)

db.defaults({})

const cacheNamespace = config.get('lowdb.cacheNamespace')

const isMultiplayer = (game) => {
  const gameTags = game.tags || {}
  const topVote = Math.max.apply(null, Object.values(gameTags))
  const threshold = topVote * config.get('steamspy.countFractionThreshold')
  const gameTagNames = Object.keys(gameTags || {})
    .filter((tag) => gameTags[tag] >= threshold)
  const multiplayerTags = config.get('steamspy.multiplayerTags')

  return _.intersection(multiplayerTags, gameTagNames).length > 0
}

const wait = (timeout, resolveValue) => {
  return new Promise((resolve) => {
    if (timeout <= 0) {
      return resolve(resolveValue)
    }

    logger.verbose(`wait for ${timeout} ms`)

    setTimeout(() => resolve(resolveValue), timeout)
  })
}

const loadById = (id) => {
  logger.http(`Request to http://steamspy.com/api.php?request=appdetails&appid=${id}`)

  return rq({
    url: `http://steamspy.com/api.php?request=appdetails&appid=${id}`,
    json: true
  }).catch((err) => {
    logger.warn('Steamspy server returned error. Proceeding anyway...')
    logger.warn(err)

    return Promise.resolve(null)
  })
}

const queue = {
  end: Promise.resolve(),
  add: function (f) {
    this.end = this.end.then(f)

    return this.end
  }
}

// automatically chooses cache over network
// and respects API limits
const getMultiplayer = (steamGame) => {
  logger.verbose(`Looking for "${steamGame.appid}" in local cache...`)

  const cachedGame = db.get([ steamGame.appid ]).value()

  if (cachedGame) {
    return Promise.resolve(isMultiplayer(cachedGame) ? cachedGame : null)
  }

  logger.verbose(`"${steamGame.appid}" not found in local cache`)

  return queue.add(() => {
      const startRequest = new Date()

      logger.debug(`Request for "${steamGame.appid}" started at ${startRequest.toISOString()}`)

      return loadById(steamGame.appid)
        .then((steamspyGame) => {
          const elapsedTime = Date.now() - startRequest

          logger.verbose(`Request for "${steamGame.appid}" took ${elapsedTime} ms`)

          logger.verbose(`got game data for "${steamGame.appid}"`)
          logger.debug({
            message: 'data',
            value: steamspyGame
          })

          if (steamspyGame) {
            steamspyGame[cacheNamespace] = {
              updatedAt: (new Date()).toISOString()
            }

            Object.assign(steamspyGame, steamGame)

            db.set([steamGame.appid], steamspyGame)
              .write()
          }

          logger.verbose(`Saved "${steamGame.appid}" to cache`)

          return wait(
            config.get('steamspy.requestInterval') - elapsedTime,
            isMultiplayer(steamspyGame) ? steamspyGame : null
          )
        })
    }
  )
}

module.exports = {
  filterMultiplayer: async (steamGames) => {
    const multiplayer = await steamGames.reduce((p, steamGame) =>
      p.then(async (games) => {
        const multiplayerGame = await getMultiplayer(steamGame)
        if (multiplayerGame) {
          games.push(multiplayerGame)
        }

        return Promise.resolve(games)
      }),
      Promise.resolve([])
    )

    return Promise.resolve(multiplayer)
  }
}
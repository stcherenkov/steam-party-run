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
  const gameTags = Object.keys(game.tags || {})
  const multiplayerTags = config.get('steamspy.multiplayerTags')

  return _.intersection(multiplayerTags, gameTags).length > 0
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
const getMultiplayerById = (id) => {
  logger.verbose(`Looking for "${id}" in local cache...`)

  const cachedGame = db.get([ id ]).value()

  if (cachedGame) {
    return Promise.resolve(isMultiplayer(cachedGame) ? cachedGame : null)
  }

  logger.verbose(`"${id}" not found in local cache`)

  return queue.add(() => {
      const startRequest = new Date()

      logger.debug(`Request for "${id}" started at ${startRequest.toISOString()}`)

      return loadById(id)
        .then((game) => {
          const elapsedTime = Date.now() - startRequest

          logger.verbose(`Request for "${id}" took ${elapsedTime} ms`)

          logger.verbose(`got game data for "${id}"`)
          logger.debug({
            message: 'data',
            value: game
          })

          if (game) {
            game[cacheNamespace] = {
              updatedAt: (new Date()).toISOString()
            }

            db.set([id], game)
              .write()
          }

          logger.verbose(`Saved "${id}" to cache`)

          return wait(
            config.get('steamspy.requestInterval') - elapsedTime,
            isMultiplayer(game) ? game : null
          )
        })
    }
  )
}

module.exports = {
  getMultiplayerById,
  filterMultiplayer: async (ids) => {
    const multiplayer = await ids.reduce((p, id) =>
      p.then(async (games) => {
        const game = await getMultiplayerById(id)
        if (game) {
          games.push(game)
        }

        return Promise.resolve(games)
      }),
      Promise.resolve([])
    )

    return Promise.resolve(multiplayer)
  }
}
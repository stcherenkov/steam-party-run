const _ = require('lodash')
const rq = require('request-promise')

const config = require('../config')
const logger = require('../loggers').get('steamspy')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(config.get('lowdb.games'))
const db = low(adapter)

db.defaults({})

const isMultiplayer = (game) => {
  const gameTags = Object.keys(game.tags || {})
  const multiplayerTags = config.get('steamspy.multiplayerTags')

  return _.intersection(multiplayerTags, gameTags).length > 0
}

const gapPromise = (timeout, resolveValue) => {
  return new Promise((resolve) => {
    if (timeout <= 0) {
      return resolve(resolveValue)
    }

    logger.debug(`gap promise - ${timeout} ms`)

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

const safeGetById = (id) => {
  // This operation is async, so other users could load this specific game already
  logger.verbose(`Looking for "${id}" in local cache...`)

  const cached = db.get([ id ]).value()

  if (cached) {
    return Promise.resolve(cached)
  }

  logger.verbose(`"${id}" not found in local cache`)

  const startRequest = Date.now()

  logger.debug(`Request for "${id}" started at ${startRequest}`)

  return loadById(id)
    .then((game) => {
      const elapsedTime = Date.now() - startRequest

      logger.debug(`Request for "${id}" took ${elapsedTime} ms`)

      logger.verbose(`got game data for "${id}"`)
      logger.debug({
        message: 'data',
        value: game
      })

      if (game) {
        db.set([ id ], game)
          .write()
      }

      logger.debug(`Saved "${id}" to cache`)

      return gapPromise(config.get('steamspy.requestInterval') - elapsedTime, game)
    })
}

const queue = {
  userQueueInProgress: false,
  userQueues: [],
  add: function (list) {
    let startUserQueue = null
    let userQueue = new Promise((resolve) => {
      startUserQueue = resolve
    })

    list.forEach((id) => {
      userQueue = userQueue
        .then(() => safeGetById(id))
    })

    this.userQueues.push(startUserQueue)
    this.start()

    return userQueue.then(() => {
      this.nextUserQueue()

      return list
    })
  },
  nextUserQueue: function () {
    this.userQueueInProgress = false
    this.start()
  },
  start: function () {
    if (this.userQueueInProgress) {
      return null
    }

    if (this.userQueues.length > 0) {
      this.userQueues.shift()()
      this.userQueueInProgress = true
    }

    return null
  }
}

module.exports = {
  safeGetById,
  filterMultiplayer: async (ids) => {
    const {
      found,
      multiplayer,
      queued
    } = ids.reduce(
      (memo, id) => {
        const game = db.get([ id ]).value()

        if (!game) {
          memo.queued.push(id)
          return memo
        }

        memo.found.push(id)

        if (isMultiplayer(game)) {
          memo.multiplayer.push(game)
        }

        return memo
      },
      {
        found: [],
        multiplayer: [],
        queued: []
      }
    )

    const updatedIds = await queue.add(queued)
    const updated = updatedIds
      .map((id) => db.get([ id ]).value())
      .filter(isMultiplayer)

    return Promise.resolve({
      multiplayer: updated.concat(multiplayer)
    })
  }
}
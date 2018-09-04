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

const getById = (id) => {
  logger.http(`Request to http://steamspy.com/api.php?request=appdetails&appid=${id}`)

  return rq({
    url: `http://steamspy.com/api.php?request=appdetails&appid=${id}`,
    json: true
  })
}

const gapPromise = (timeout) => {
  return new Promise((resolve) => {
    if (timeout <= 0) {
      return resolve()
    }

    logger.debug(`gap promise - ${timeout} ms`)

    setTimeout(resolve, timeout)
  })
}

const queue = {
  length: 0,
  end: Promise.resolve(),
  add: function (list) {
    list.forEach((id) => {
      const startRequest = Date.now()
      this.length += 1
      this.end = this.end
        .then(() => getById(id))
        .then(
          (res) => {
            const elapsedTime = Date.now() - startRequest

            logger.verbose(`got game data for "${id}"`)
            logger.debug({
              message: 'data',
              value: res
            })

            this.length -= 1
            db.set([ id ], res)
              .write()

            return gapPromise(config.get('steamspy.requestInterval') - elapsedTime)
          },
          (err) => {
            const elapsedTime = Date.now() - startRequest

            logger.warn(err)

            return gapPromise(config.get('steamspy.requestInterval') - elapsedTime)
          }
        )
    })
  }
}

module.exports = {
  getById,
  filterMultiplayer: (ids) => {
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

    queue.add(queued)

    return Promise.resolve({
      found,
      multiplayer,
      queued
    })
  }
}
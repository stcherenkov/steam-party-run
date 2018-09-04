const rq = require('request-promise')
const _ = require('lodash')

const logger = require('../loggers').get('steam')
const config = require('../config')

const resolveUrlToId = (username) => {
  logger.debug(`resolving user url "${username}"`)

  return rq({
    url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/`,
    qs: {
      key: config.get('steam.apiKey'),
      vanityurl: username,
      format: 'json'
    },
    json: true
  })
    .then((rs) => {
      logger.log({
        level: 'debug',
        message: `ISteamUser/ResolveVanityURL?vanityurl=${username}`,
        value: rs
      })

      const steamId = _.get(rs, 'response.steamid')

      if (!steamId) {
        return Promise.reject(new Error('No user found'))
      }

      return Promise.resolve(steamId)
    }, (err) => {
      logger.error(err)

      return Promise.reject(new Error('Could not connect to Steam server'))
    })
}

module.exports = {
  getUserGames: async (username, sort = null) => {
    logger.silly(`api key = ${config.get('steam.apiKey')}`)

    const steamId = await resolveUrlToId(username)
    logger.debug(`steamId = ${steamId}`)

    return rq({
      url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
      qs: {
        key: config.get('steam.apiKey'),
        steamid: steamId,
        format: 'json'
      },
      json: true
    }).then((rs) => {
      logger.log({
        level: 'debug',
        message: `IPlayerService/GetOwnedGames?steamid=${steamId}`,
        value: rs
      })

      const rawGames = _.get(rs, 'response.games', [])
      const games = sort ?
        rawGames.sort(sort).map((item) => item.appid) :
        rawGames.map((item) => item.appid)

      return Promise.resolve(games)
    })
  }
}

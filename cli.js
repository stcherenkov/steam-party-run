#!/usr/bin/env node

const program = require('commander')
const ora = require('ora')

const steamspy = require('./src/proxies/steamspy')
const steam = require('./src/proxies/steam')


program
  .command('cache <users>')
  .action((users, cmd) => {
    console.log('hi')
    const spinner = ora('Populating cache...').start()
    const usernames = users.split(',')
    let total = 0

    usernames
      .reduce((p, username) => p.then(() => {
        spinner.text = `Caching games of ${username}...`
        steam
          .getUserGames(
            username,
            (a, b) => b.playtime_forever - a.playtime_forever
          )
          .then((gameIds) => steamspy.filterMultiplayer(gameIds))
          .then(({ multiplayer }) => total += multiplayer.length)
      }), Promise.resolve())
      .then(() => spinner.succeed(`Cached total ${total} multiplayer games`))
  })

program.parse(process.argv)

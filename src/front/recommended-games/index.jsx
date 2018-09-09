import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import intersectionBy from 'lodash/intersectionBy.js'

import { GameItem } from './game-item.jsx'

export const GameList = (props) => {
  if (props.games.length === 0) {
    return (
      <section>
        <h2>No games to display</h2>
      </section>
    )
  }
  return (
    <section>
      <h2>Recommended games</h2>
      <ul>
        {props.games.map((game) => (
          <GameItem key={game.appid} {...game} />
        ))}
      </ul>
    </section>
  )
}

GameList.propTypes = {
  games: propTypes.array
}

GameList.defaultProps = {
  games: []
}

export default connect(
  (state) => {
    const multiplayer = state.multiplayer
    const partyGames = state.party.map((url) => state.profiles[url] && state.profiles[url].games).filter((item) => !!item)

    const args = [
      multiplayer,
      ...partyGames,
      (game) => game.appid
    ]

    return {
      games: intersectionBy.apply(null, args).sort((a, b) => a.name > b.name)
    }
  }
)(GameList)

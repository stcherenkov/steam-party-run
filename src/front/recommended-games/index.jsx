import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import intersectionBy from 'lodash/intersectionBy.js'

import { Section } from '../common.jsx'

import { GameItem } from './game-item.jsx'
import style from './style.css'

export const GameList = (props) => {
  if (props.noParty) {
    return null
  }

  if (props.games.length === 0) {
    return (
      <Section title="No games to display" />
    )
  }

  return (
    <Section title="Recommended games">
      <ul className={style.games}>
        {props.games.map((game) => (
          <GameItem key={game.appid} {...game} />
        ))}
      </ul>
    </Section>
  )
}

GameList.propTypes = {
  games: propTypes.array,
  noParty: propTypes.bool
}

GameList.defaultProps = {
  games: [],
  noParty: true
}

export default connect(
  (state) => {
    const multiplayer = state.multiplayer
    const partyGames = state.party.map((url) =>
      state.profiles[url] &&
      state.profiles[url].games
    ).filter((item) => !!item && item.length > 0)

    const args = [
      multiplayer,
      ...partyGames,
      (game) => game.appid
    ]

    return {
      games: intersectionBy.apply(null, args).sort((a, b) => a.name > b.name),
      noParty: state.party.length <= 0
    }
  }
)(GameList)

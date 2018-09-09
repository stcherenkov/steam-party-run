import React from 'react'
import propTypes from 'prop-types'

export const GameItem = (props) => (
  <li>
    <img src={props.logoUrl} />
    <span>{props.name}</span>
    <a href={`steam://nav/games/details/${props.appid}`}>Open in Steam</a>
  </li>
)

GameItem.propTypes = {
  appid: propTypes.number.isRequired,
  name: propTypes.string.isRequired,
  logoUrl: propTypes.string.isRequired
}

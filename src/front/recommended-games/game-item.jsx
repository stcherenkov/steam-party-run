import React from 'react'
import propTypes from 'prop-types'

import style from './style.css'

export const GameItem = (props) => (
  <li className={style.game}>
    <a
      href={`steam://nav/games/details/${props.appid}`}
      className={style.link}
      title="Open in Steam"
    >
      <img
        className={style.background}
        src={props.logoUrl}
        alt={`${props.name} logo`}
      />
      <span
        className={style.title}
      >
        {props.name}
      </span>
    </a>
  </li>
)

GameItem.propTypes = {
  appid: propTypes.number.isRequired,
  name: propTypes.string.isRequired,
  logoUrl: propTypes.string.isRequired
}

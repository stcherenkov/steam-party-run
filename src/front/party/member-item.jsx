import React from 'react'
import propTypes from 'prop-types'
import noop from 'lodash/noop.js'
import { connect } from 'react-redux'

import { removeFromParty } from '../data/actions.js'

import style from './style.css'
import removeImg from './remove.svg'

const personastates = [
  'offline',
  'online',
  'busy',
  'busy',
  'busy',
  'online',
  'online'
]

export const MemberItem = (props) => {
  if (!props.profile) {
    return (
      <li className={style.member}>
        <img
          alt="Avatar not loaded yet"
          className={style.avatar}
          title="Loading user data..."
        />
        <span className={style.name}>???</span>
      </li>
    )
  }

  if (!props.profile.recent) {
    return (
      <li className={style.member}>
        <img
          src={props.profile.avatarfull}
          alt={`${props.profile.personaname} avatar`}
          className={style.avatar}
          title="Updating user status..."
        />
        <span className={style.name}>{props.profile.personaname}</span>
      </li>
    )
  }

  const status = personastates[props.profile.personastate]

  return (
    <li
      className={`${style.member} ${style[status]}`}
    >
      <img
        src={props.profile.avatarfull}
        alt={`${props.profile.personaname} avatar`}
        className={style.avatar}
        title={`User is currently ${status}`}
      />
      <span className={style.name}>{props.profile.personaname}</span>
      <button
        className={style.remove}
        onClick={props.onRemove}
        style={{
          backgroundImage: `url(${removeImg})`
        }}
      >
        Remove
      </button>
    </li>
  )
}

MemberItem.propTypes = {
  url: propTypes.string.isRequired,
  idx: propTypes.number.isRequired,
  profile: propTypes.object,
  onRemove: propTypes.func
}

MemberItem.defaultProps = {
  onRemove: noop
}

export default connect(
  (state, ownProps) => ({
    profile: state.profiles[ownProps.url]
  }),
  (dispatch, ownProps) => ({
    onRemove: () => dispatch(removeFromParty(ownProps.idx))
  })
)(MemberItem)

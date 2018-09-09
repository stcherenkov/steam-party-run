import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import { addToParty } from '../data/actions.js'

import style from './style.css'

export const FriendItem = (props) => {
  if (!props.personaname) {
    return null
  }

  return (
    <li className={style.recentItem}>
      <button
        onClick={props.onClick}
        title={`Add ${props.personaname} to party`}
        className={style.recentButton}
        style={{
          backgroundImage: `url(${props.avatarmedium})`
        }}
      >
        {props.personaname}
      </button>
    </li>
  )
}

FriendItem.propTypes = {
  avatarmedium: propTypes.string,
  personaname: propTypes.string,
  url: propTypes.string.isRequired
}

export default connect(
  (state, ownProps) => state.profiles[ownProps.url] || {},
  (dispatch, ownProps) => ({
    onClick: () => dispatch(addToParty(ownProps.url))
  })
)(FriendItem)

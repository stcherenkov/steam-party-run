import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import { addToParty } from '../data/actions.js'

export const FriendItem = (props) => {
  if (!props.personaname) {
    return null
  }

  return (
    <li>
      <button
        onClick={props.onClick}
        title={props.personaname}
      >
        <img
          src={props.avatarmedium}
          alt={`${props.personaname} avatar`}
        />
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

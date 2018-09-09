import React from 'react'
import propTypes from 'prop-types'
import noop from 'lodash/noop.js'
import { connect } from 'react-redux'

import { removeFromParty } from '../data/actions.js'

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
      <li>Unknown</li>
    )
  }

  if (!props.profile.recent) {
    return (
      <li>
        <img src={props.profile.avatarfull} /> {props.profile.personaname} updating...
      </li>
    )
  }

  return (
    <li>
      <img src={props.profile.avatarfull} /> {props.profile.personaname} {personastates[props.profile.personastate]}
      <button onClick={props.onRemove}>Remove</button>
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

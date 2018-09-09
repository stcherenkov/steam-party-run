import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import UrlInput from './url-input.jsx'
import FriendItem from './friend-item.jsx'

export const SelectFriends = (props) => (
  <section>
    <h2>Add friends</h2>
    <UrlInput />
    {props.recent.length > 0 && (
      <ul>
        {props.recent.map((url) => (
          <FriendItem key={url} url={url} />
        ))}
      </ul>
    )}
  </section>
)

SelectFriends.propTypes = {
  recent: propTypes.arrayOf(
    propTypes.string
  )
}

SelectFriends.defaultProps = {
  recent: []
}

export default connect(
  (state) => ({
    recent: state.friends
  })
)(SelectFriends)

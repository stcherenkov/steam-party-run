import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import { Section } from '../common.jsx';

import UrlInput from './url-input.jsx'
import FriendItem from './friend-item.jsx'

import style from './style.css'

export const SelectFriends = (props) => (
  <Section title="Add friends">
    <UrlInput />
    {props.recent.length > 0 && (
      <ul className={style.recent}>
        {props.recent.map((url) => (
          <FriendItem key={url} url={url} />
        ))}
      </ul>
    )}
  </Section>
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

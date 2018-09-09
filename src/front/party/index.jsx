import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import MemberItem from './member-item.jsx'

export const Party = (props) =>
  <section>
    <h2>Your party</h2>
    <ul>
    {props.urls.map((url, idx) =>
      (
        <MemberItem
          key={url}
          url={url}
          idx={idx}
        />
      )
    )}
    </ul>
  </section>

Party.propTypes = {
  urls: propTypes.arrayOf(
    propTypes.string
  )
}

Party.defaultProps = {
  urls: []
}

export default connect(
  (state) => ({
    urls: state.party
  })
)(Party)

import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'

import { Section } from '../common.jsx'

import MemberItem from './member-item.jsx'
import style from './style.css'

export const Party = (props) => {
  if (props.urls.length === 0) {
    return <Section title="You must gather your party before venturing forth!" />
  }
  return (
    <Section title="Your party">
      <ul className={style.party}>
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
    </Section>
  )
}
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

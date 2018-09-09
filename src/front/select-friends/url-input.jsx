import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import noop from 'lodash/noop.js'

import { addToParty } from '../data/actions.js'

export class UrlInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  static propTypes = {
    onSubmit: propTypes.func
  }

  static defaultProps = {
    onSubmit: noop
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const value = this.state.value

    this.props.onSubmit(value)

    this.setState({
      value: ''
    })
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="steam-url"
          type="url"
          autoFocus
          onChange={this.handleChange}
          value={this.state.value}
        />
        <button type="submit">Add user</button>
      </form>
    )
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    onSubmit: (value) => dispatch(addToParty(value))
  })
)(UrlInput)

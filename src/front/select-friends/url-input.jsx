import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import noop from 'lodash/noop.js'

import { addToParty } from '../data/actions.js'

import style from './style.css'

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
      <form
        className={style.form}
        onSubmit={this.handleSubmit}
      >
        <label
          className={style.label}
          htmlFor="steam-url"
        >
          Insert link to Steam profile in the box below:
        </label>
        <input
          id="steam-url"
          name="steam-url"
          type="url"
          autoFocus
          onChange={this.handleChange}
          value={this.state.value}
          className={style.input}
        />
        <button
          type="submit"
          className={style.submit}
        >
          Add
        </button>
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

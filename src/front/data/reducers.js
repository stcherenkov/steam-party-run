import { combineReducers } from 'redux'
import uniq from 'lodash/uniq'

import { setLocalStorageJSON } from '../utils.js'

import * as types from './action-types.js'

export function friends (state = [], action) {
  switch (action.type) {
    case types.PARTY_ADD: {
      const nextState = uniq(state.concat(action.url))

      setLocalStorageJSON('friends', nextState)

      return nextState
    }
    default: {
      return state
    }
  }
}

export function profiles (state = {}, action) {
  switch (action.type) {
    case types.PROFILE_UPDATE: {
      setLocalStorageJSON(action.url, action.user)

      return Object.assign({}, state, {
        [action.url]: Object.assign({ recent: true }, action.user)
      })
    }
    default: {
      return state
    }
  }
}

export function party (state = [], action) {
  switch (action.type) {
    case types.PARTY_ADD: {
      return state.concat(action.url)
    }
    case types.PARTY_REMOVE: {
      return state.slice(0, action.index).concat(state.slice(action.index + 1))
    }
    default: {
      return state
    }
  }
}

export function multiplayer (state = [], action) {
  switch (action.type) {
    case types.MULTIPLAYER_INIT: {
      return action.list
    }
    case types.MULTIPLAYER_CLEAR: {
      return []
    }
    default: {
      return state
    }
  }
}

export function errors (state = {}, action) {
  switch (action.type) {
    case types.ERROR_THROW: {
      const region = state[action.region].concat(action.message)
      return Object.assign({}, state, {
        [action.region]: region
      })
    }
    case types.ERROR_DISMISS: {
      return Object.assign({}, state, {
        [action.region]: []
      })
    }
    default: {
      return state
    }
  }
}

export default combineReducers({
  friends,
  profiles,
  party,
  multiplayer,
  errors
})

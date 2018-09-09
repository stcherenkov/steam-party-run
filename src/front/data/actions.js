import axios from 'axios'
import get from 'lodash/get.js'

import * as types from './action-types.js'

import { apiQueryFromUrl } from '../utils.js'

let updatingMultiplayerLastRequestId = 0

const API = get(window, 'config.apiRoot', '')

export const addToParty = (url) => (dispatch, getState) => {
  const { party } = getState()
  const query = apiQueryFromUrl(url)

  if (party.indexOf(url) >= 0) {
    dispatch({
      type: types.ERROR_THROW,
      region: 'select-friends',
      message: 'User already joined the party'
    })
    return Promise.reject()
  }

  dispatch({
    type: types.PARTY_ADD,
    url
  })

  // FIXME: add sad path
  if (query) {
    if (party.length === 0) {
      const requestId = updatingMultiplayerLastRequestId + 1
      updatingMultiplayerLastRequestId = requestId
      axios.get(`${API}/user/multiplayer?${query}`)
        .then(({ data }) => {
          if (requestId === updatingMultiplayerLastRequestId) {
            dispatch({
              type: types.MULTIPLAYER_INIT,
              list: data.multiplayer
            })
          }
        })
    }

    return axios.get(`${API}/user?${query}`)
      .then(({ data }) => {
        dispatch({
          type: types.PROFILE_UPDATE,
          url,
          user: data.user
        })
      })
  }

  dispatch({
    type: types.ERROR_THROW,
    region: 'select-friends',
    message: 'That\'s not a steam link!'
  })
  return Promise.reject()
}

export const removeFromParty = (index) => (dispatch, getState) => {
  if (index === 0) {
    const state = getState()

    dispatch({
      type: types.MULTIPLAYER_CLEAR
    })

    if (state.party.length > 1) {
      const query = apiQueryFromUrl(state.party[0])
      const requestId = updatingMultiplayerLastRequestId + 1
      updatingMultiplayerLastRequestId = requestId
      axios.get(`${API}/user/multiplayer?${query}`)
        .then(({ data }) => {
          if (requestId === updatingMultiplayerLastRequestId) {
            dispatch({
              type: types.MULTIPLAYER_INIT,
              list: data.multiplayer
            })
          }
        })
    }
  }

  dispatch({
    type: types.PARTY_REMOVE,
    index
  })
}

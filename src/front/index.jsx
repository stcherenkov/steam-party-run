import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { reducers, middlewares } from './data'

import { App } from './app.jsx'
import { getLocalStorageJSON } from './utils.js'

let initialStore = {
  friends: getLocalStorageJSON('friends', [])
}

initialStore.profiles = initialStore.friends.reduce((memo, url) => {
  memo[url] = getLocalStorageJSON(url)
  return memo
}, {})

render(
  <Provider
    store={createStore(reducers, initialStore, middlewares)}
  >
    <App />
  </Provider>,
  document.getElementById('app')
)

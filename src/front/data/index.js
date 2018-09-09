import { applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const middlewares = composeEnhancers(
  applyMiddleware(
    thunk
  )
)

export { default as reducers } from './reducers.js'

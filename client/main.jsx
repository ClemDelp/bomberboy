// IMPORT
import 'babel-polyfill'
import React from 'react'
import { applyMiddleware, compose, createStore } from 'redux'
import { Meteor } from 'meteor/meteor'
import rootReducer from './reducers'
import Root from './containers/Root'
import ReactDOM from 'react-dom'
import {apiRequest} from './utils/api'
import {
  mergeIntoGameState,
  setElement,
  removeElement
} from './reducers/game'
import {config} from '../config'

//
// SAGA
//

import rootSaga from './sagas'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()

//
// STORE
//
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension
    ? window.devToolsExtension()
    : f => f
  )
)
sagaMiddleware.run(rootSaga)

//
// APP
//
Meteor.startup(() => {
  // mount app
	const reactDivElement = document.getElementById('render-target')
	if (reactDivElement) {
		ReactDOM.render(<Root store={store} />, reactDivElement)
    // GET CONTEXT GAME
    apiRequest('/getContextGame', {method: 'GET'}, (response) => {
      if (response.data) {
        const {
          layers,
          ghosts,
          players,
          playerId
        } = response.data
        if (
          layers &&
          ghosts &&
          players &&
          playerId
        ) {
          const elements = Object.assign({}, ghosts, players)
          store.dispatch(
            mergeIntoGameState({
              elements,
              layers,
              // ghosts,
              // players,
              playerId
            })
          )
        }
      }
    })
	}
})

//
// STREAM
if (config.game.stream) {
  Streamy.on('gameStream', function (response) {
    if (
      response &&
      response.type &&
      response.data
    ) {
      const element = response.data
      switch (response.type) {
        case 'mvt':
          store.dispatch(setElement(element.id, element))
          break;

        case 'add':
          store.dispatch(setElement(element.id, element))
          break;

        case 'rm':
          store.dispatch(removeElement(element.id))
          break;

      }
    }
  })
}
//
// DEBUGS
// Since we don't want all those debug messages
Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info)
  }
})(Meteor._debug)

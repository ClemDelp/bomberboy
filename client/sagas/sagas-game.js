import { call, put, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import { ADD_GAME_ACTION } from '../reducers/reducer-game'

export function * broadcastGameAction (action) {
  console.log('broadcast action', action)
  if (
    action &&
    action.gameAction &&
    action.broadcast
  ) {
    Streamy.broadcast('gameStream', {
      type: 'gameAction',
      data: action.gameAction
    })
  }
}

export function * watchAddAction () {
  yield * takeEvery(ADD_GAME_ACTION, broadcastGameAction)
}

import { fork } from 'redux-saga/effects'
import { watchAddAction } from './sagas-game'

export default function * rootSaga () {
  yield [
    fork(watchAddAction)
  ]
}

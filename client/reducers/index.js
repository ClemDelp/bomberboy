//
// IMPORTS
//

import { combineReducers } from 'redux'
import game from './reducer-game'

//
// COMBINE
//

const rootReducer = combineReducers({
  game
})

//
// EXPORT
//
export default rootReducer

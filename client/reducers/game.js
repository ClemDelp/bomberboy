//
// IMPORTS
//
export const MERGE_INTO_GAME_STATE = 'MERGE_INTO_GAME_STATE'

//
// INITIAL STATE
//
const intialState = {
  map: [],
  ghostsLayer: []
}

//
// REDUCER
//

export default function game (state = intialState, action) {
  switch (action.type) {

    case MERGE_INTO_GAME_STATE:
      return Object.assign({}, state, action.patch)

    default:
      return state
  }
}

//
// EXPORT
//

export function mergeIntoGameState (patch) {
  return {
    type: MERGE_INTO_GAME_STATE,
    patch
  }
}

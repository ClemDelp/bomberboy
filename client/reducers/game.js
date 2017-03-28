//
// EXPORTS
//
export const MERGE_INTO_GAME_STATE = 'MERGE_INTO_GAME_STATE'
export const SET_ELEMENT = 'SET_ELEMENT'

//
// INITIAL STATE
//

const intialState = {
  layers: [],
  mainPlayerCoord: {},
  elements: {}, // all game elements by element id
}

//
// REDUCER
//

export default function game (state = intialState, action) {
  switch (action.type) {

    case MERGE_INTO_GAME_STATE:
      return Object.assign({}, state, action.patch)

    case SET_ELEMENT:
      let stateClone = Object.assign({}, state)
      stateClone.elements[action.id] = action.element
      return Object.assign({}, state, stateClone)

    default:
      return state
  }
}

//
// EXPORT
//

export function setElement (id, element) {
  return {
    type: SET_ELEMENT,
    id,
    element
  }
}

export function mergeIntoGameState (patch) {
  return {
    type: MERGE_INTO_GAME_STATE,
    patch
  }
}

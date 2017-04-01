//
// EXPORTS
//
export const MERGE_INTO_GAME_STATE = 'MERGE_INTO_GAME_STATE'
export const SET_ELEMENT = 'SET_ELEMENT'
export const REMOVE_ELEMENT = 'REMOVE_ELEMENT'

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
  let stateClone = {}
  switch (action.type) {

    case MERGE_INTO_GAME_STATE:
      return Object.assign({}, state, action.patch)

    case SET_ELEMENT:
      stateClone = Object.assign({}, state)
      stateClone.elements[action.id] = action.element
      return Object.assign({}, state, stateClone)

    case REMOVE_ELEMENT:
      stateClone = Object.assign({}, state)
      stateClone.elements = Object.keys(stateClone.elements).reduce((result, key) => {
        const element = stateClone.elements[key]
        if (element.id !== action.id) result[element.id] = element
        return result
      }, {})
      return stateClone

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
export function removeElement (id) {
  return {
    type: REMOVE_ELEMENT,
    id
  }
}
export function mergeIntoGameState (patch) {
  return {
    type: MERGE_INTO_GAME_STATE,
    patch
  }
}

//
// EXPORTS
//
export const MERGE_INTO_GAME_STATE = 'MERGE_INTO_GAME_STATE'
export const PATCH_ELEMENT = 'PATCH_ELEMENT'
export const REMOVE_ELEMENT = 'REMOVE_ELEMENT'
export const ADD_GAME_ACTION = 'ADD_GAME_ACTION'
export const REMOVE_GAME_ACTION = 'REMOVE_GAME_ACTION'

//
// INITIAL STATE
//

const intialState = {
  layers: [],
  mainPlayerCoord: {},
  elements: {}, // all game elements by element id
  gameActions: {}
}

//
// REDUCER
//

export default function game (state = intialState, action) {
  let stateClone = {}
  switch (action.type) {

    case MERGE_INTO_GAME_STATE:
      return Object.assign({}, state, action.patch)

    case PATCH_ELEMENT:
      stateClone = Object.assign({}, state)
      stateClone.elements[action.id] = action.patch
      return Object.assign({}, state, stateClone)

    case ADD_GAME_ACTION:
      stateClone = Object.assign({}, state)
      stateClone.gameActions[action.id] = action.gameAction
      return Object.assign({}, state, stateClone)

    case REMOVE_GAME_ACTION:
      stateClone = Object.assign({}, state)
      stateClone.gameActions = Object.keys(stateClone.gameActions).reduce((result, gameActionId) => {
        const gameAction = stateClone.gameActions[gameActionId]
        if (gameActionId !== action.gameActionId) result[gameActionId] = gameAction
        return result
      }, {})
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

export function patchElement (id, patch) {
  return {
    type: PATCH_ELEMENT,
    id,
    patch
  }
}
export function addGameAction (id, gameAction) {
  return {
    type: ADD_GAME_ACTION,
    id,
    gameAction
  }
}
export function removeGameAction (gameActionId) {
  return {
    type: REMOVE_GAME_ACTION,
    gameActionId
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

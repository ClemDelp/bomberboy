import {guid} from './utils'
import {config} from '../config'

class Element {
  constructor () {
    this.x = null
    this.y = null
    this.id = guid()
    this.deplacements = ['down','right','up','left']
  }
  setPosition (position) {
    this.x = position.x
    this.y = position.y
  }
}

export class Ghost extends Element {
  constructor () {
    super()
    const {ghost} = config
    this.type = ghost.name
    this.val = ghost.val
    this.canHover = ghost.canHover
    this.orientation = ghost.orientation
    this.velocity = ghost.velocity
  }
}

export class Player extends Element {
  constructor () {
    super()
    const {player} = config
    this.type = player.name
    this.val = player.val
    this.canHover = player.canHover
    this.orientation = player.orientation
    this.velocity = player.velocity
  }
}

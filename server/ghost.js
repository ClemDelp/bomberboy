import {guid} from './utils'
import {config} from '../config'
import eden from 'node-eden'

class Element {
  constructor () {
    this.name = eden.adam()
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
    this.canHover = player.canHover
    this.orientation = player.orientation
    this.velocity = player.velocity
  }
}

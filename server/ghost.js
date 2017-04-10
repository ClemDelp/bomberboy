import {guid} from './utils'
import {config} from '../config'
import eden from 'node-eden'

class Element {
  constructor () {
    this.name = eden.adam()
    this.x = null
    this.y = null
    this.id = guid()
  }
  setPosition (position) {
    this.x = position.x
    this.y = position.y
  }
}

export class Ghost extends Element {
  constructor () {
    super()
    Object.keys(config.ghost).forEach((key) => {
      this[key] = config.ghost[key]
    })
    this.deplacements = Object.keys(config.ghost.animations)
  }
}

export class Player extends Element {
  constructor () {
    super()
    Object.keys(config.player).forEach((key) => {
      this[key] = config.player[key]
    })
    this.deplacements = Object.keys(config.player.animations)
  }
}

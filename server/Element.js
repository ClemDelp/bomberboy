import { guid } from './utils'
import eden from 'node-eden'

export default class Element {
  constructor () {
    this.name = eden.adam()
    this.x = null
    this.y = null
    this.id = guid()
    this.type = 'element'
    this.canHover = []
    this.img = null
    this.animations = null
    this.size = null
    this.scale = null
    this.orientation = null
    this.tileName = null
    this.alpha = 1
    this.anchor = 0.5
    this.physics = {isoArcade: true}
    this.body = {
      collideWorldBounds: true,
      immovable: false,
      gravity: {z: -500},
      velocity: {z: 200}
    }
    this.isoZ = 0
  }
  setPosition (position) {
    this.x = position.x
    this.y = position.y
  }
}

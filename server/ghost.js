import {guid} from './utils'
import {config} from './config'

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
    this.type = 'ghost'
    this.val = 2 // important for map
    this.canHover = [0]
    this.orientation = 'down'
    this.color = '#27ae60'
  }
}

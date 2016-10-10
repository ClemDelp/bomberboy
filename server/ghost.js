import {guid} from './utils'
import {config} from './config'

class Bob {
  constructor(position) {
    this.x = position.x
    this.y = position.y
    this.id = guid()
    this.orientation = "down"
    this.color = "#27ae60"
    this.deplacement = ["down","right","up","left"]
  }
}

export class Ghost extends Bob {
  constructor(position) {
    super(position)
    this.type = 'Ghost'
    this.val = 2 // important for map
  }
}

import Layer from './layer'
import { config, layers } from '../config'
import Ghost from './Ghost'
import Player from './Player'
import { getRandomInt } from './utils'
import heightmap from 'heightmap-generator'

export class Game {
  constructor (map) {
    // PARAMETERS
    this.ghostsById = {}
    this.playersById = {}
    this.layers = {}
    // SET BLOCK LAYER
    let blockLayer = new Layer()
    let treesLayers = new Layer()
    // let tilemap = layers.blockLayer
    // let tilemap = layers.isoLayers
    let tilemap = layers.isoTilesMap
    if (config.map.perlin) {
      // PERLIN
      let size = config.map.rows / 10
      if (size < 1) size = 1
      let levels = tilemap.elements.length
      var noise = heightmap(size, levels, config.map.reverseMap, 1)
      for (let x = 0; x < noise.length; x++) {
        for (let y = 0; y < noise[x].length; y++) {
          const val = noise[x][y] - 1
          if (tilemap.elements[val]) blockLayer.setVal(x, y, tilemap.elements[val])
        }
      }
    } else {
      for (let y = 0; y < blockLayer.cols; y++) {
        for (let x = 0; x < blockLayer.rows; x++) {
          var val = 0
          if (Math.random() * 10 % 2 > 1) {
            var elIndex = getRandomInt(0, tilemap.elements.length - 1)
            tilemap.elements[elIndex]
          }
          blockLayer.setVal(x, y, val)
        }
      }
    }
    // TREES LAYERS
    if (config.map.trees) {
      const treesElements = layers.treesLayers.elements
      for (let yy = 0; yy < blockLayer.rows; yy++) {
        for (let xx = 0; xx < blockLayer.cols; xx++) {
          var ii = getRandomInt(0, treesElements.length - 1)
          var treeElement = treesElements[ii]
          if (getRandomInt(0, 3) === 3) {
            // IF THIS TREE CAN BE ON THIS GROUND TYPE
            const supportBlockElement = blockLayer.getVal(yy, xx)
            if (treeElement.canHover.indexOf(supportBlockElement.type) > -1) {
              treeElement.isoZ = supportBlockElement.isoZ + 100
              treesLayers.setVal(yy, xx, treeElement)
            }
          }
        }
      }
    }
    // DEFINE LAYERS
    this.layers = {
      'block': blockLayer,
      'trees': treesLayers
    }
  }
  getRefSize () {
    return config.map.squareSize
  }
  addPlayer () {
    const refSize = this.getRefSize()
    const newPlayer = new Player()
    const position = this.getFreePosition(newPlayer)
    newPlayer.setPosition({
      x: position.x * refSize,
      y: position.y * refSize
    })
    this.playersById[newPlayer.id] = newPlayer
    Streamy.broadcast('gameStream', {
      type: 'add',
      data: newPlayer
    })
    return newPlayer
  }
  initGhosts () {
    for (let i = 0; i < config.map.defaultGhostNumber; i++) {
      this.addGhost()
    }
  }
  addGhost () {
    const refSize = this.getRefSize()
    const newGhost = new Ghost()
    const position = this.getFreePosition(newGhost)
    newGhost.setPosition({
      x: position.x * refSize + (refSize - (config.ghost.size[0] * config.ghost.scale[0])) / 2,
      y: position.y * refSize + (refSize - (config.ghost.size[1] * config.ghost.scale[1])) / 2
    })
    this.ghostsById[newGhost.id] = newGhost
    this.move(newGhost.id)
    return newGhost
  }
  getFreePosition (element) {
    if (element) {
      let x = 0
      let y = 0
      let found = false
      // while we found free position
      while (!found) {
        x = getRandomInt(0, config.map.cols - 1)
        y = getRandomInt(0, config.map.rows - 1)
        found = this.isFreePosition(x, y, element)
      }
      return {x, y}
    }
  }
  isFreePosition (x, y, element) {
    // Check on all layers
    const layer = this.layers.block
    const supportBlockElement = layer.getVal(y, x)
    if (
      supportBlockElement &&
      element.canHover.indexOf(supportBlockElement.type) > -1
    ) {
      element.isoZ = supportBlockElement.isoZ + 100
      return true
    } else return false
  }
  getMatrixCoordWithPosition (x, y) {
    const refSize = this.getRefSize()
    const col = Math.floor(x / refSize)
    const row = Math.floor(y / refSize)
    return {col, row}
  }
  move (id) {
    const ghost = this.ghostsById[id]
    const deplacements = ghost.deplacements
    this.promise(ghost, deplacements)
    // .catch(function(e) {
    //   console.error('error: ', e)
    //   console.error('stack:', e.stack)
    // })
    .then(
      (ghost) => {
        // RESOLVE
        Streamy.broadcast('gameStream', {
          type: 'mvt',
          data: ghost
        })
        setTimeout(() => {
          this.move(ghost.id)
        }, config.ghost.speed)
      },
      (ghost) => {
        // --------------------------
        // remove ghost
        Streamy.broadcast('gameStream', {
          type: 'rm',
          data: ghost
        })
        delete this.ghostsById[ghost.id]
        // create new ghost 2 second after
        setTimeout(() => {
          const newGhost = this.addGhost()
          Streamy.broadcast('gameStream', {
            type: 'add',
            data: newGhost
          })
        }, 2000)
      }
    ).catch((e) => {
      console.error(e)
    })
  }
  promise (ghost, deplacements) {
    return new Promise((resolve, reject) => {
      for (let test = 0; test < config.ghost.triesBeforeExplosion; test++) {
        if (this.canMove(ghost)) {
          resolve(ghost)
          break
        } else {
          ghost.orientation = deplacements[Math.round(Math.random() * 3)]
        }
      }
      reject(ghost)
    })
  }
  canMove (ghost) {
    const refSize = this.getRefSize()
    const steps = ghost.velocity
    const orientation = ghost.orientation
    const ghostW = config.ghost.size[0] * config.ghost.scale[0]
    const ghostH = config.ghost.size[0] * config.ghost.scale[0]
    let colIndex = 0
    let rowIndex = 0
    let x = ghost.x
    let y = ghost.y
    switch (orientation) {
      case 'down':
        y = y + steps
        colIndex = Math.floor((x + (ghostW / 2)) / refSize)
        rowIndex = Math.floor((y + ghostH) / refSize)
        break

      case 'up':
        y = y - steps
        colIndex = Math.floor((x + (ghostW / 2)) / refSize)
        rowIndex = Math.floor(y / refSize)
        break

      case 'right':
        x = x + steps
        colIndex = Math.floor((x + ghostW) / refSize)
        rowIndex = Math.floor((y + ghostH / 2) / refSize)
        break

      case 'left':
        x = x - steps
        colIndex = Math.floor(x / refSize)
        rowIndex = Math.floor((y + (ghostH / 2)) / refSize)
        break
    }

    if (
      colIndex === config.map.cols ||
      rowIndex === config.map.rows ||
      colIndex < 0 ||
      rowIndex < 0
    ) {
      return false
    }

    if (this.isFreePosition(colIndex, rowIndex, ghost)) {
      ghost.x = x
      ghost.y = y
      return true
    }
    return false
  }
}

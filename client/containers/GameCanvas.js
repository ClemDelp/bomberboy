//
// IMPORT
//

import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../config'
import {apiRequest} from '../utils/api'
import {mapLoading} from '../utils/mapLoading'
import {
  mergeIntoGameState,
  patchElement,
  removeGameAction
} from '../reducers/game'
import {
  getNewCoords,
  print2DMatrix,
  getCoordsAround,
  createLayer
} from '../utils/smartLayers'
import {
  movementController,
  movementAnimation
} from '../utils/phaser-movement'

//
// ENV
//

let water = []
let tree = []
const refSize = config.map.squareSize
var dynamicElementsById = {} // --> all the moving elements
var mainPlayerObj = {}
var mainPlayer // main player
var cursors
var textElements = {}
var elementsGroup
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
var bulletTime = 0
var prevCoord = {x: 0, y: 0}
var spritesLayers = {}

//
// COMPONENT
//

class GameCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      refSize: config.map.squareSize
    }
    this.create = this.create.bind(this)
    this.preload = this.preload.bind(this)
    this.update = this.update.bind(this)
    this.attachTextToSprite = this.attachTextToSprite.bind(this)
    this.renderCanvas = this.renderCanvas.bind(this)
    this.addExplosion = this.addExplosion.bind(this)
    this.teleportation = this.teleportation.bind(this)
    this.addTeleportationAnimation = this.addTeleportationAnimation.bind(this)
  }
  preload () {
    const {game} = this.state
    game.stage.backgroundColor = '#007236'
    Object.keys(config).forEach((key) => {
      const el = config[key]
      if (el.name && el.img) game.load.image(el.name, el.img)
      console.log(el.img)
    })
    game.load.spritesheet('tilemap', 'assets/sprites/tilemap.png', 100.6, 127.5) // width of a element, height
    game.load.spritesheet('boom', 'assets/sprites/explosion_3.png', 128, 128)
    game.load.spritesheet('tpt', 'assets/sprites/teleportation.png', 100, 100)
    game.load.spritesheet('dude', 'assets/sprites/bob.gif', 17.5, 32)
    game.load.spritesheet('ghost', 'assets/sprites/ghosts.png', 48, 48) // 19 img per row
    // --------------------------------------
    // ISOMETRIC
    // --------------------------------------
    game.time.advancedTiming = true
    game.debug.renderShadow = false
    game.stage.disableVisibilityChange = true
    game.plugins.add(new Phaser.Plugin.Isometric(game))
    //  Modify the world and camera bounds
    game.world.setBounds(-50, -50, config.map.width, config.map.height)
    // Start the IsoArcade physics system.
    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE)
    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    game.iso.anchor.setTo(0.5, 0.2)
    game.stage.backgroundColor = '#2d2d2d'
    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.TOP_BOTTOM
    // game.load.spritesheet('tile', 'assets/sprites/basic_ground_tiles.png', 128, 128) // width of a element, height
    game.load.spritesheet('tile', 'assets/sprites/iso_tiles.png', 103, 103) // width of a element, height
    game.load.spritesheet('tree', 'assets/sprites/tree_tiles.png', 103, 103) // width of a element, height
    // --------------------------------------
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ])
  }
  create () {
    const {game} = this.state
    const {
      layers,
      elements,
      playerId
    } = this.props
    // CREATE GROUPS
    elementsGroup = game.add.physicsGroup();
    // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
    elementsGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE
    elementsGroup.enableBody = true
    // RENDER MAP LAYERS
    if (layers) {
      Object.keys(layers).forEach((layerName, index) => {
        const layer = layers[layerName]
        const newSpriteLayer = createLayer(layer.matrix.length)
        for (var y = 0; y < layer.matrix.length; y++) {
          for (var x = 0; x < layer.matrix[y].length; x++) {
            const element = layer.matrix[y][x]
            const refSize = layer.refSize
            if (element.val && element.val.type) {
              const newSprite = this.addElementToMap(element, x, y)
              // newSpriteLayer[y][x] = newSprite
            }
          }
        }
        spritesLayers[layerName] = newSpriteLayer
      })
    }

    if (elements) {
      Object.keys(elements).forEach((key) => {
        const element = elements[key]
        const el = this.addElementToMap(element, element.x, element.y)
      })
    }
  }
  addExplosion (x, y, z) {
    const {game} = this.state
    var explosion = game.add.isoSprite(x, y, z, 'boom')
    explosion.anchor.set(0.5)
    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters
    // it's going to make an animation from all available
    // frames in the 'mummy' sprite sheet
    var boom = explosion.animations.add('boom')
    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    explosion.animations.play('boom', 10, false)
    game.camera.shake(0.05, 100)
  }
  attachTextToSprite (sprite, element) {
    const text = element.name
    const {game} = this.state
    var style = {
      font: "15px Arial",
      fill: "#ff0044",
      wordWrap: true,
      wordWrapWidth: sprite.width,
      align: "center"
    }
    let textElement = game.add.text(sprite.x, sprite.y - sprite.height, text, style)
    textElement.anchor.set(0.5)
    textElements[element.id] = {
      element: textElement,
      sprite: sprite,
      id: element.id
    }

  }
  addElementToMap (element, x, y) {
    const val = element.val ? element.val : element
    const {game, refSize} = this.state
    const {playerId} = this.props
    let el = game.add.isoSprite(
      (val.type === 'player' || val.type === 'ghost' ) ? x : x * refSize,
      (val.type === 'player' || val.type === 'ghost' ) ? y : y * refSize,
      val.isoZ,
      val.tileName,
      0,
      elementsGroup
    )
    el.id = element.id
    el.elementType = val.type
    el.explosion = val.explosion
    if (val.tye === 'player' || val.type === 'ghost') el.scale.setTo(val.scale[0], val.scale[1])
    else el.scale.setTo(val.scale[0], val.scale[1], val.isoZ / 10)

    if (val.animations) {
      Object.keys(val.animations).forEach((key) => {
        const animation = val.animations[key]
        el.animations.add(
          key,
          animation.frames,
          animation.duration,
          animation.loop
        )
      })
    }
    el.frame = val.frame
    el.alpha = 0 //val.alpha
    game.add.tween(el).to( { alpha: val.alpha }, 1000, Phaser.Easing.Linear.None, true)
    el.anchor.set(val.anchor)

    if (val.physics.isoArcade) game.physics.isoArcade.enable(el)
    el.body.gravity.z = val.body.gravity.z
    el.body.collideWorldBounds = val.body.collideWorldBounds // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
    // Add a full bounce on the x and y axes, and a bit on the z axis.
    // cube.body.bounce.set(0, 0, 0.5);
    el.body.immovable = val.body.immovable
    switch (val.type) {
      case 'tree':
        el.body.checkCollision.up = true
        el.body.checkCollision.down = true
        el.body.checkCollision.frontX = false
        el.body.checkCollision.frontY = false
        el.body.checkCollision.backX = false
        el.body.checkCollision.backY = false
        break

      case 'water':
        water.push(el)
        break

      case 'ghost':
        this.attachTextToSprite(el, val)
        // dynamicElementsById[el.id] = el
        break

      case 'player':
        // add player name above
        this.attachTextToSprite(el, val)
        // If it's the main player
        if (el.id === playerId) {
          game.camera.follow(el, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
          mainPlayer = el
          mainPlayerObj = element
          // Set up our controls.
          cursors = game.input.keyboard.createCursorKeys()
          var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
          space.onDown.add(() => {
            mainPlayer.body.velocity.z = val.body.velocity.z
            this.broadcastGameAction({type: 'jump', elementId: mainPlayer.id})
          }, this)
        } else {
          // dynamicElementsById[el.id] = el
        }
        break
    }
    dynamicElementsById[el.id] = el
    return el
  }
  removeElement (sprite) {
    if (
      sprite.elementType === 'player' ||
      sprite.elementType === 'ghost'
    ){
      if (sprite.explosion) this.addExplosion(sprite.body.x, sprite.body.y, sprite.body.z)
      elementsGroup.remove(sprite)
      sprite.destroy()
      if (textElements[sprite.id]) textElements[sprite.id].element.destroy()
    }
  }
  getCoord (x, y) {
    return {x: Math.round(x / refSize), y: Math.round(y / refSize)}
  }
  isNewCoord (coord) {
    const {x, y} = coord
    if (prevCoord.x !== x || prevCoord.y !== y) return true
    return false
  }
  update () {
    const {game} = this.state
    const {
      elements,
      gameActions,
      removeGameAction
    } = this.props
    // ---------------------------------
    // COLLISIONS
    if (config.map.physic) game.physics.isoArcade.collide(elementsGroup)
    // ---------------------------------
    // CREATION LOOP
    Object.keys(elements).forEach((key) => {
      const element = elements[key]
      if (
        !dynamicElementsById[key] &&
        element.id !== mainPlayerObj.id
      ) {
        this.addElementToMap(element)
      }
    })
    // ---------------------------------
    // ACTION LOOP
    Object.keys(gameActions).forEach((actionId) => {
      const action = gameActions[actionId]
      if (action.elementId !== mainPlayerObj.id) {
        removeGameAction(actionId)
        switch (action.type) {
          case 'jump':
            const sprite = dynamicElementsById[action.elementId]
            const element = elements[action.elementId]
            if (
              sprite &&
              sprite.body &&
              sprite.body.velocity &&
              element &&
              element.body &&
              element.body.velocity
            ) {
              sprite.body.velocity.z = element.body.velocity.z
            }
            break;
        }
      }
    })
    // ---------------------------------
    // UPDATE AND REMOVE LOOP
    elementsGroup.forEach((sprite) => {
      if (elements[sprite.id]) {
        const element = elements[sprite.id]
        if (element.id !== mainPlayerObj.id) {
          sprite.body.x = element.x
          sprite.body.y = element.y
          // Animation
          if (sprite.orientation !== element.orientation) {
            sprite.animations.play(element.orientation)
            movementAnimation(sprite, element.orientation)
          }
        }
      } else this.removeElement(sprite)
    })
    // ---------------------------------
    // UNDERSTAND USER MOVING
    const position = this.getCoord(mainPlayer.isoX, mainPlayer.isoY)
    const direction = this.getDelta(position, prevCoord)
    if (
      this.isNewCoord(position) &&
      (
        Math.abs(direction.x) > 5 ||
        Math.abs(direction.y) > 5
      )
    ) {
      prevCoord = {x: position.x, y: position.y}
      this.props.mergeIntoGameState({mainPlayerCoord: position})
      const sizeAround = 10
      const target = {
        x: position.x,
        y: position.y
      }
      const actualAround = getCoordsAround(position, sizeAround + 10)
      const nextAround = getCoordsAround(target, sizeAround)
      const coordsToLoad = getNewCoords(actualAround, nextAround)
      const coordsToRemove = getNewCoords(nextAround, actualAround)
      const {layers} = this.props
      Object.keys(layers).forEach((layerName, index) => {
        const layerFromProps = layers[layerName]
        nextAround.forEach((coord) => {
          const element = layerFromProps.matrix[coord.y] && layerFromProps.matrix[coord.y][coord.x]
          if (element && element.val && element.val.type) {
            if (spritesLayers[layerName][coord.y][coord.x] === 0) {
              const newSprite = this.addElementToMap(element, coord.x, coord.y)
              spritesLayers[layerName][coord.y][coord.x] = newSprite
            }
          }
        })
        coordsToRemove.forEach((coord) => {
          const spriteToRemove = spritesLayers[layerName][coord.y] && spritesLayers[layerName][coord.y][coord.x]
          if (spriteToRemove) {
            spriteToRemove.destroy()
            spritesLayers[layerName][coord.y][coord.x] = 0
          }
        })
      })
    }
    // ---------------------------------
    // WATER MVT
    if (config.map.waterAnimation) {
      water.forEach(function (w) {
        w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
        w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1)
      })
    }
    // --------------------------------
    // Move the player at this speed.
    movementController (
      cursors,
      mainPlayer,
      mainPlayerObj,
      this.brodcastPlayerUpdate
    )
    // ---------------------
    // DEPHTSORT
    if (config.map.depthSort) {
      if (config.map.topologicalSort) game.iso.topologicalSort(elementsGroup)
      else game.iso.simpleSort(elementsGroup)
    }
    // ---------------------
    // update text elements positions
    Object.keys(textElements).forEach((key) => {
      const textElement = textElements[key]
      textElement.element.x = Math.floor(textElement.sprite.x + textElement.sprite.width / 2)
      textElement.element.y = Math.floor(textElement.sprite.y - 10)
    })
    // ---------------------
  }
  addTeleportationAnimation (x, y) {
    const {game} = this.state
    var teleportation = game.add.sprite(x, y, 'tpt');
    teleportation.anchor.set(0.5)
    var tpt = teleportation.animations.add('tpt');
    teleportation.animations.play('tpt', 20, false);
  }
  teleportation (element) {
    const {game} = this.state
    if (game.time.now > bulletTime) {
      bulletTime = game.time.now + 250;
      // GET CONTEXT GAME
      apiRequest('/teleportation', {method: 'POST', body: element}, (response) => {
        if (response.data) {
          const from = Object.assign({}, mainPlayerObj)
          this.addTeleportationAnimation(from.x, from.y)
          mainPlayerObj.x = response.data.x * refSize
          mainPlayerObj.y = response.data.y * refSize
          mainPlayer.x = response.data.x * refSize
          mainPlayer.y = response.data.y * refSize
          const to = Object.assign({}, mainPlayerObj)
          this.addTeleportationAnimation(to.x, to.y)
        }
      })
    }
  }
  getDelta (currentCoord, prevCoord) {
    return {
      x: currentCoord.x - prevCoord.x,
      y: currentCoord.y - prevCoord.y
    }
  }
  broadcastGameAction (gameAction) {
    Streamy.broadcast('gameStream', {
      type: 'gameAction',
      data: gameAction
    })
  }
  brodcastPlayerUpdate () {
    console.log('broadCast user update...', mainPlayer.orientation)
    mainPlayerObj.x = mainPlayer.body.x
    mainPlayerObj.y = mainPlayer.body.y
    mainPlayerObj.orientation = mainPlayer.orientation
    // for client
    Streamy.broadcast('gameStream', {
      type: 'mvt',
      data: mainPlayerObj
    })
    // for server
    Streamy.emit('gameStream', {
      type: 'brodcastPlayerUpdate',
      data: mainPlayerObj
    })
  }
  renderCanvas () {
    const {game} = this.state
    game.debug.text('fps: ' + game.time.fps || '--', 2, 14, "#ffffff");
    // elementsGroup.forEach(function (tile) {
    //     game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
    // });
    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.text('Sprite z-depth: ' + mainPlayer.z, 10, 20);
    // game.debug.text('mainPlayer.x: ' + mainPlayer.x, 10, 20);
  }

  // first time
  componentDidMount () {
    var game = new Phaser.Game(
      WIDTH,
      HEIGHT,
      Phaser.CANVAS,
      'phaser-example',
      {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render : this.renderCanvas
      }
    )
    this.setState({game})
    // before leave remove user
    window.onbeforeunload = (event) => {
      Streamy.broadcast('gameStream', {
        type: 'rm',
        data: mainPlayerObj
      })
      Streamy.emit('gameStream', {
        type: 'rmMainPlayer',
        data: mainPlayerObj
      })
    }
  }

  render () {
    return (
      <div id='phaser-example' />
    )
  }
}

//
// EXPORT
//

function mapStateToProps ({
  game: {
    layers,
    elements,
    playerId,
    gameActions
  }
}) {
  return {
    layers,
    elements,
    playerId,
    gameActions
  }
}

export default connect(
  mapStateToProps,
  {
    mergeIntoGameState,
    patchElement,
    removeGameAction
  }
)(GameCanvas)

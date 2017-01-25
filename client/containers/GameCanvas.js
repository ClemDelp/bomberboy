//
// MODULE
//
import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../config'
import {apiRequest} from '../utils/api'
import {mapLoading} from '../utils/mapLoading'
import {mergeIntoGameState} from '../reducers/game'

//
// ENV
//

let water = []
let tree = []
let hashMap = {}
let mapMatrix = []
const BUFFER_LIMIT = 100
let buffer = []
let newPlayerBuffer = []
const refSize = config.map.squareSize
var dynamicElementsById = {} // --> all the moving elements
var mainPlayerObj = {}
var mainPlayer // main player
var cursors
var cursor3D
var textElements = {}
var elementsGroup
var isoGroup
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
var spaceKey
var bulletTime = 0
var prevCoord = {x: 0, y: 0}
var selectedTile = {}
//
// STREAMS
//
Streamy.on('newPlayer', function (response) {
  if (
    response &&
    response.data
  ) newPlayerBuffer.push(response.data)
})

Streamy.on('gameStream', function (response) {
  if (
    response &&
    response.type &&
    response.data &&
    buffer.length < BUFFER_LIMIT
  ) buffer.push(response)
  if(buffer.length === BUFFER_LIMIT) console.log('buffer full')
})

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
    game.world.setBounds(-50, -50, 2000, 2000)

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
  }

  create () {
    const {game} = this.state
    const {
      layers,
      ghosts,
      players,
      playerId
    } = this.props
    // Set the global gravity for IsoArcade.
    // game.physics.isoArcade.gravity.setTo(0, 0, -500);
    // CREATE GROUPS
    elementsGroup = game.add.group()
    // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
    elementsGroup.enableBody = true
    elementsGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE
    // RENDER MAP LAYERS
    if (layers) {
      Object.keys(layers).forEach((layerName, index) => {
        console.log(layerName)
        const layer = layers[layerName]
        const matrixSize = layer.matrix.length
        for (var row = 0; row < matrixSize; row++) {
          mapMatrix[row] = []
          for (var col = 0; col < matrixSize; col++) {
            mapMatrix[row][col] = 0
          }
        }
        for (var y = 0; y < layer.matrix.length; y++) {
          for (var x = 0; x < layer.matrix[y].length; x++) {
            const element = layer.matrix[y][x]
            const refSize = layer.refSize
            if (element.val && element.val.type) {
              // this.addBlockToMap(element, refSize, x, y)
              this.addElementToMap(element, x, y)
            }
          }
        }
      })
    }
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ])

    if (ghosts) {
      Object.keys(ghosts).forEach((key) => {
        const ghost = ghosts[key]
        this.addGhost(ghost)
      })
    }

    if (players) {
      Object.keys(players).forEach((key) => {
        const player = players[key]
        // this.addPlayerToMap(game, player, playerId)
        console.log(player)
        this.addElementToMap(player, player.x, player.y)
      })
    }
  }
  // addBlockToMap (element, refSize, x, y) {
  //   const {game} = this.state
  //   let cube = game.add.isoSprite(
  //     x * refSize,
  //     y * refSize,
  //     0,
  //     element.val.tileName,
  //     0,
  //     elementsGroup
  //   )
  //   cube.scale.setTo(element.val.scale[0], element.val.scale[1], element.val.z / 10)
  //
  //   cube.frame = element.val.frame
  //   cube.alpha = 1
  //   cube.id = element.id
  //
  //   cube.isoZ += element.val.z
  //   cube.anchor.set(0.5)
  //   // Enable the physics body on this cube.
  //   game.physics.isoArcade.enable(cube)
  //
  //   // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
  //   cube.body.collideWorldBounds = true
  //
  //   // Add a full bounce on the x and y axes, and a bit on the z axis.
  //   // cube.body.bounce.set(0, 0, 0.5);
  //   cube.body.immovable = true
  //
  //   switch (element.val.type) {
  //     case 'water':
  //       water.push(cube)
  //       break
  //
  //     case 'tree':
  //       tree.push(cube)
  //       cube.body.gravity.z = -500
  //       cube.isoZ += 200
  //       break
  //   }
  //
  //   // add block to main mapMatrix
  //   mapMatrix[y][x] = cube
  //   return cube
  // }
  addGhost (ghost) {
    const {game} = this.state
    // const newGhost = game.add.sprite(ghost.x, ghost.y, config.ghost.name)
    // newGhost.scale.setTo(config.ghost.scale[0], config.ghost.scale[1]);

    const newGhost = game.add.sprite(ghost.x, ghost.y, 'ghost')
    newGhost.animations.add('right', [0, 20], 10, true)
    newGhost.animations.add('down', [40, 60], 10, true)
    newGhost.animations.add('left', [80, 100], 10, true)
    newGhost.animations.add('up', [120, 140], 10, true)

    newGhost.scale.setTo(0.75, 0.75)

    dynamicElementsById[ghost.id] = newGhost
    this.attachTextToSprite(newGhost, ghost)
  }
  addExplosion (x, y) {
    const {game} = this.state
    var explosion = game.add.sprite(x, y, 'boom')
    explosion.anchor.set(0.5)
    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
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
      val.type === 'player' ? x : x * refSize,
      val.type === 'player' ? y : y * refSize,
      0,
      val.tileName,
      0,
      elementsGroup
    )

    el.id = element.id
    el.elementType = val.type
    if (val.tye === 'player') el.scale.setTo(val.scale[0], val.scale[1])
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
    el.alpha = val.alpha
    el.isoZ += val.isoZ
    el.anchor.set(val.anchor)

    if (val.physics.isoArcade) game.physics.isoArcade.enable(el)
    el.body.gravity.z = val.body.gravity.z
    el.body.collideWorldBounds = val.body.collideWorldBounds // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
    // Add a full bounce on the x and y axes, and a bit on the z axis.
    // cube.body.bounce.set(0, 0, 0.5);
    el.body.immovable = val.body.immovable
    switch (val.type) {
      case 'water':
        water.push(el)
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
          space.onDown.add(() => {mainPlayer.body.velocity.z = val.body.velocity.z}, this)
        } else {
          dynamicElementsById[el.id] = el
        }
        break
    }
    return el
  }
  // addPlayerToMap (game, player, playerId) {
  //   var newPlayer = game.add.isoSprite(player.x, player.y, 0, 'dude', 0, elementsGroup)
  //   newPlayer.elementType = player.type
  //   newPlayer.scale.setTo(1.25, 1.25)
  //   newPlayer.animations.add('top', [0, 1, 2], 10, true)
  //   newPlayer.animations.add('right', [3, 4, 5], 10, true)
  //   newPlayer.animations.add('bottom', [6, 7, 8], 10, true)
  //   newPlayer.animations.add('left', [9, 10, 11], 10, true)
  //   newPlayer.isoZ += 200
  //   newPlayer.anchor.set(0.5)
  //   game.physics.isoArcade.enable(newPlayer)
  //   newPlayer.body.gravity.z = -500
  //   newPlayer.body.collideWorldBounds = true
  //   game.camera.follow(newPlayer, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
  //   // add player name above
  //   this.attachTextToSprite(newPlayer, player)
  //   // If it's the main player
  //   if (player.id === playerId) {
  //     mainPlayer = newPlayer
  //     mainPlayerObj = player
  //     // Set up our controls.
  //     cursors = game.input.keyboard.createCursorKeys()
  //     game.input.keyboard.addKeyCapture([
  //       Phaser.Keyboard.LEFT,
  //       Phaser.Keyboard.RIGHT,
  //       Phaser.Keyboard.UP,
  //       Phaser.Keyboard.DOWN,
  //       Phaser.Keyboard.SPACEBAR
  //     ])
  //
  //     var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  //     space.onDown.add(function () {
  //         mainPlayer.body.velocity.z = 200
  //     }, this)
  //   } else {
  //     dynamicElementsById[player.id] = newPlayer
  //   }
  // }
  removeElement (element, explosion) {
    sprite = dynamicElementsById[element.id]
    if (sprite) {
      if (explosion) this.addExplosion(element.x, element.y)
      elementsGroup.remove(sprite)
      sprite.destroy()
      if (textElements[element.id]) textElements[element.id].element.destroy()
    }
  }
  addElement (element) {
    switch (element.type) {
      case 'ghost':
        this.addGhost(element)
        break
    }
  }
  getCoord (x, y) {
    return {x: Math.round(x / refSize), y: Math.round(y / refSize)}
  }
  isNewCoord (coord) {
    const {x, y} = coord
    if (prevCoord.x !== x || prevCoord.y !== y) {
      prevCoord = {x, y}
      return true
    }
    return false
  }
  update () {
    const {game} = this.state
    // ---------------------------------
    // UNDERSTAND USER MOVING
    const coord = this.getCoord(mainPlayer.isoX, mainPlayer.isoY)
    const delta = this.getDelta(coord, prevCoord)
    if (this.isNewCoord(coord)) {
      // if (mapMatrix[coord.y] && mapMatrix[coord.y][coord.x]) {
      //   selectedTile.isoZ += 4
      //   selectedTile = mapMatrix[coord.y][coord.x]
      //   selectedTile.isoZ -= 4
      // }
      this.props.mergeIntoGameState({mainPlayerCoord: coord})
      // const m = {x: 2, y: 2}
      // const o = {x: 0, y: 0}
      // const coordsToLoad = mapLoading(delta, o, m)
      // console.log('coordsToLoad --> ', coordsToLoad)
    }
    // ---------------------------------
    // WATER MVT
    if (config.map.waterAnimation) {
      water.forEach(function (w) {
        w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
        w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1)
      })
    }
    // ---------------------------------
    // BUFFERS MANAGERS
    if (buffer.length > 0) {
      // const element =
      buffer.forEach((element) => {
        buffer.shift()
        const {type, data} = element
        switch (type) {
          // move element
          case 'mvt':
            if (
              data.id != mainPlayerObj.id &&
              dynamicElementsById[data.id]
            ) {
              var sprite = dynamicElementsById[data.id]
              sprite.animations.play(data.orientation)
              sprite.x = data.x
              sprite.y = data.y
            }
            break;
          // remove element
          case 'rm':
            data.forEach((el) => {
              switch (el.type) {
                case 'ghost':
                  // console.log('remove ghost')
                  this.removeElement(el, true)
                  break;
                case 'block':
                  // console.log('remove block')
                  this.removeElement(el, false)
                  break;
              }
            })
            break
          // add element
          case 'add':
            this.addElement(data)
            break
        }
      })
    }
    if (newPlayerBuffer.length > 0) {
      console.log('new player !!!')
      const newPlayer = newPlayerBuffer.shift()
      this.addPlayerToMap(game, newPlayer, playerId)
    }
    // --------------------------------
    // BLOCK TRANSPARENCY
    if (config.game.blockTransparency) {
      blocks.forEach((block) => {
        if (block) {
          if (
            mainPlayer.x < block.x + refSize &&
            mainPlayer.x >= block.x &&
            mainPlayer.y > block.y - refSize &&
            mainPlayer.y <= block.y
          ) {
            game.add.tween(block).to( { alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true)
          } else {
            game.add.tween(block).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true)
          }
        }
      })
    }
    // --------------------------------
    // Move the player at this speed.
    var speed = 200
    mainPlayer.body.velocity.x = 0
    mainPlayer.body.velocity.y = 0

    if (cursors.up.isDown && cursors.left.isDown) {
      mainPlayer.animations.play('top')
      mainPlayer.body.velocity.x = -speed
      this.updateMainPlayerObj()
    }
    else if (cursors.up.isDown && cursors.right.isDown) {
      mainPlayer.animations.play('right')
      mainPlayer.body.velocity.y = -speed
      this.updateMainPlayerObj()
    }
    else if (cursors.down.isDown && cursors.left.isDown) {
      mainPlayer.animations.play('left')
      mainPlayer.body.velocity.y = speed
      this.updateMainPlayerObj()
    }
    else if (cursors.down.isDown && cursors.right.isDown) {
      mainPlayer.animations.play('right')
      mainPlayer.body.velocity.x = speed
      this.updateMainPlayerObj()
    }
    else if (cursors.up.isDown) {
      mainPlayer.animations.play('top')
      mainPlayer.body.velocity.x = -speed
      mainPlayer.body.velocity.y = -speed
      this.updateMainPlayerObj()
    }
    else if (cursors.down.isDown) {
      mainPlayer.animations.play('bottom')
      mainPlayer.body.velocity.x = speed
      mainPlayer.body.velocity.y = speed
      this.updateMainPlayerObj()
    }
    else if (cursors.left.isDown) {
        mainPlayer.animations.play('left')
        mainPlayer.body.velocity.x = -speed + 100
        mainPlayer.body.velocity.y = speed - 100
        this.updateMainPlayerObj()
    }
    else if (cursors.right.isDown) {
      mainPlayer.animations.play('right')
      mainPlayer.body.velocity.x = speed - 100
      mainPlayer.body.velocity.y = -speed + 100
      this.updateMainPlayerObj()
    }

    if (
      mainPlayer.body.velocity.x === 0 &&
      mainPlayer.body.velocity.y === 0
    ) mainPlayer.animations.stop()

    // Our collision and sorting code again.
    game.physics.isoArcade.collide(elementsGroup)
    game.iso.topologicalSort(elementsGroup)
    // ---------------------
    // update text elements positions
    Object.keys(textElements).forEach((key) => {
      const textElement = textElements[key]
      textElement.element.x = Math.floor(textElement.sprite.x + textElement.sprite.width / 2)
      textElement.element.y = Math.floor(textElement.sprite.y - 10)
    })
    // ---------------------
    // re order Z depth
    // elementsGroup.sort('y', Phaser.Group.SORT_ASCENDING);
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
  updateMainPlayerObj () {
    mainPlayerObj.x = mainPlayer.x
    mainPlayerObj.y = mainPlayer.y
    // for client
    Streamy.broadcast('gameStream', {
      type: 'mvt',
      data: mainPlayerObj
    })
    // for server
    Streamy.emit('gameStream', { data: mainPlayerObj })
  }
  collisionHandler (player, block) {
    // here put the collision logic
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
  }

  render () {
    return (
      <div id='phaser-example'></div>
    )
  }
}

//
// EXPORT
//
function mapStateToProps ({
  game: {
    layers,
    ghosts,
    players,
    playerId
  }
}) {
  return {
    layers,
    ghosts,
    players,
    playerId
  }
}

export default connect(
  mapStateToProps,
  {
    mergeIntoGameState
  }
)(GameCanvas)

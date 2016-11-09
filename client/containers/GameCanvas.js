//
// MODULE
//
import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../config'
import {arrayToCsv} from '../utils/arrayToCsv'

//
// ENV
//
const BUFFER_LIMIT = 100
let buffer = []
let newPlayerBuffer = []

//
// STREAMS
//
Streamy.on('newPlayer', function (response) {
  if (
    response &&
    response.data &&
    response.data.id != mainPlayerObj.id
  ) newPlayerBuffer.push(response.data)
})

Streamy.on('gameStream', function (response) {
  if (
    response &&
    response.data &&
    buffer.length < BUFFER_LIMIT &&
    response.data.id != mainPlayerObj.id
  ) buffer.push(response.data)
  if(buffer.length === BUFFER_LIMIT) console.log('buffer full')
})

//
// COMPONENT
//
var dynamicElementsById = {} // --> all the moving elements
var mainPlayerObj = {} // --> all the moving elements
let playersGroup // players group
var mainPlayer // main player
var group // ghosts group
var cursors;
var textElements = []

class GameCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.create = this.create.bind(this)
    this.preload = this.preload.bind(this)
    this.update = this.update.bind(this)
    this.attachTextToSprite = this.attachTextToSprite.bind(this)
    this.renderCanvas = this.renderCanvas.bind(this)
  }
  preload () {
    const {game} = this.state
    game.stage.backgroundColor = '#007236'
    game.load.image(config.player.name, config.player.img);
    game.load.image(config.block.name, config.block.img);
    game.load.image(config.ghost.name, config.ghost.img)
    game.load.image('tiles', 'assets/sprites/tilemap.jpg');
  }

  create () {
    const {game} = this.state
    const {
      layers,
      ghosts,
      players,
      playerId
    } = this.props
    //  Modify the world and camera bounds
    game.world.setBounds(-50, -50, 2000, 2000)
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';
    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.TOP_BOTTOM;
    // CREATE GROUPS
    ghostsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    playersGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);

    // RENDER MAP LAYERS
    if (layers) {
      //  Creates a new blank layer and sets the map dimensions.
      //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
      // let map_layer = layers.map
      // console.log(map_layer)
      // const tile_height = map_layer.rows
      // const tile_width = map_layer.cols
      // let refSize = map_layer.elementRef.size[0] * map_layer.elementRef.scale[0]
      // const csv = arrayToCsv(map_layer)
      // //  Add data to the cache
      // console.log(csv)
      // game.cache.addTilemap('dynamicMap', null, csv, Phaser.Tilemap.CSV);
      //
      // //  Create our map (the 16x16 is the tile size)
      // refSize = 45
      // map = game.add.tilemap('dynamicMap', refSize, refSize);
      // console.log(map)
      // //  'tiles' = cache image key, 16x16 = tile size
      // map.addTilesetImage('tiles', 'tiles', refSize, refSize);
      //
      // //  0 is important
      // layer = map.createLayer(0);
      //
      // //  Scroll it
      // layer.resizeWorld();


      Object.keys(layers).forEach((layerName, index) => {
        const layer = layers[layerName]
        for (var y = 0; y < layer.matrix.length; y++) {
          for (var x = 0; x < layer.matrix[y].length; x++) {
            const element = layer.matrix[y][x]
            const refSize = layer.elementRef.size[0] * layer.elementRef.scale[0]
            if (element.val === 1) { // BLOCK
              var block = ghostsGroup.create(x * refSize, y * refSize, config.block.name);
              block.scale.setTo(config.block.scale[0], config.block.scale[1]);
              block.body.immovable = true;
            }
          }
        }
      })
    }

    if (ghosts) {
      Object.keys(ghosts).forEach((key) => {
        const ghost = ghosts[key]
        const newGhost = game.add.sprite(ghost.x, ghost.y, config.ghost.name)
        // newGhost.anchor.setTo(-0.9, -0.9);
        newGhost.scale.setTo(config.ghost.scale[0], config.ghost.scale[1]);
        dynamicElementsById[ghost.id] = newGhost
        this.attachTextToSprite(newGhost, ghost.name)
      })
    }

    if (players) {
      Object.keys(players).forEach((key) => {
        const player = players[key]
        if (player.id === playerId) { // If it's the main player
          mainPlayerObj = player
          mainPlayer = game.add.sprite(player.x, player.y, config.player.name)
          mainPlayer.scale.setTo(config.player.scale[0], config.player.scale[1]);
          game.physics.arcade.enable(mainPlayer)
          // attach camera to main player
          game.camera.follow(mainPlayer, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
          // add player name above
          this.attachTextToSprite(mainPlayer, player.name)
        } else { // Other players
          this.addPlayerToMap(player)
        }
      })
    }

    cursors = game.input.keyboard.createCursorKeys()
  }
  attachTextToSprite (sprite, text) {
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
    textElements.push({
      element: textElement,
      sprite: sprite
    })

  }
  addPlayerToMap (player) {
    var newPlayer = playersGroup.create(player.x, player.y, config.player.name);
    newPlayer.scale.setTo(config.player.scale[0], config.player.scale[1]);
    dynamicElementsById[player.id] = newPlayer
    // add player name above
    this.attachTextToSprite(newPlayer, player.name)
  }
  update () {
    const {game} = this.state
    // SET COLLISIONS
    game.physics.arcade.collide(mainPlayer, ghostsGroup, this.collisionHandler, null, this);
    // BUFFERS MANAGERS
    if (buffer.length > 0) {
      // const element =
      buffer.forEach((element) => {
        buffer.shift()
        if (dynamicElementsById[element.id]) {
          dynamicElementsById[element.id].x = element.x
          dynamicElementsById[element.id].y = element.y
        }
      })

    }
    if (newPlayerBuffer.length > 0) {
      console.log('new player !!!')
      const newPlayer = newPlayerBuffer.shift()
      this.addPlayerToMap(newPlayer)
    }
    // MAIN USER DEPLACEMENTS
    mainPlayer.body.velocity.x = 0;
    mainPlayer.body.velocity.y = 0;
    if (cursors.left.isDown)
    {
        mainPlayer.body.velocity.x = -200;
        this.updateMainPlayerObj()
    }
    else if (cursors.right.isDown)
    {
        mainPlayer.body.velocity.x = 200;
        this.updateMainPlayerObj()
    }

    if (cursors.up.isDown)
    {
        mainPlayer.body.velocity.y = -200;
        this.updateMainPlayerObj()
    }
    else if (cursors.down.isDown)
    {
        mainPlayer.body.velocity.y = 200;
        this.updateMainPlayerObj()
    }
    // update text elements positions
    textElements.forEach((textElement) => {
      textElement.element.x = Math.floor(textElement.sprite.x + textElement.sprite.width / 2)
      textElement.element.y = Math.floor(textElement.sprite.y - 10)
    })
  }
  updateMainPlayerObj () {
    mainPlayerObj.x = mainPlayer.x
    mainPlayerObj.y = mainPlayer.y
    // for client
    Streamy.broadcast('gameStream', { data: mainPlayerObj })
    // for server
    Streamy.emit('gameStream', { data: mainPlayerObj })
  }
  collisionHandler (player, block) {
    // here put the collision logic
  }

  renderCanvas () {
    const {game} = this.state
    // game.debug.cameraInfo(game.camera, 32, 32);
  }

  // first time
  componentDidMount () {
    var cursors;
    var logo1;
    var logo2;
    console.log(window.innerHeight)
    console.log(window.innerWidth)
    var game = new Phaser.Game(
      window.innerWidth,
      window.innerHeight,
      Phaser.CANVAS,
      'phaser-example',
      {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render : this.renderCanvas
      })
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

  }
)(GameCanvas)

//
// MODULE
//
import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../config'

//
// ENV
//
const BUFFER_LIMIT = 10
let buffer = []

//
// STREAM
//
Streamy.on('gameStream', function (response) {
  if (response && buffer.length < BUFFER_LIMIT) buffer.push(response.data)
})

//
// COMPONENT
//

var ghostsById = {} // --> all the moving elements
let playersById = {}
let playersGroup // players group
var mainPlayer // main player
var group // ghosts group
var cursors;

class GameCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.create = this.create.bind(this)
    this.preload = this.preload.bind(this)
    this.update = this.update.bind(this)
    this.renderCanvas = this.renderCanvas.bind(this)
    this.getGhostBuffer = this.getGhostBuffer.bind(this)
    this.state = {
      ghostBuffer: props.ghostBuffer
    }
  }

  getGhostBuffer () {
    return this.state.getGhostBuffer
  }

  preload () {
    const {game} = this.state
    game.stage.backgroundColor = '#007236'
    game.load.image(config.player.name, config.player.img);
    game.load.image(config.block.name, config.block.img);
    game.load.image(config.ghost.name, config.ghost.img)
  }

  create () {
    const {game} = this.state
    const {layers, player} = this.props
    //  Modify the world and camera bounds
    game.world.setBounds(-50, -50, 2000, 2000)
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';
    game.physics.arcade.sortDirection = Phaser.Physics.Arcade.TOP_BOTTOM;
    // CREATE GROUPS
    ghostsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    playersGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);


    // RENDER EACH LAYER
    if (layers) {
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
            else if (element.val === 2) { // GHOST
              const newGhost = game.add.sprite(x * refSize, y * refSize, config.ghost.name)
              // newGhost.anchor.setTo(-0.9, -0.9);
              newGhost.scale.setTo(config.ghost.scale[0], config.ghost.scale[1]);
              ghostsById[element.id] = newGhost
            }
            else if (element.val === 3) { // PLAYER
              if (element.id === player.id) { // If it's the main player
                mainPlayer = game.add.sprite(x * refSize, y * refSize, config.player.name)
                mainPlayer.scale.setTo(config.player.scale[0], config.player.scale[1]);
                game.physics.arcade.enable(mainPlayer);
                game.camera.follow(mainPlayer, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
              } else { // Other players
                var newPlayer = playersGroup.create(x * refSize, y * refSize, config.player.name);
                newPlayer.scale.setTo(config.player.scale[0], config.player.scale[1]);
                playersById[element.id] = newPlayer
              }
            }
          }
        }
      })
    }
    cursors = game.input.keyboard.createCursorKeys()
  }

  update () {
    const {game} = this.state
    // SET COLLISIONS
    game.physics.arcade.collide(mainPlayer, ghostsGroup, this.collisionHandler, null, this);
    // BUFFER MANAGER
    if (buffer.length > 0) {
      const element = buffer.shift()
      if (element.type === config.ghost.name) {
        // console.log('element --> ', element)
        const coef = 95 * 0.4
        ghostsById[element.id].x = element.x * coef
        ghostsById[element.id].y = element.y * coef
      }
    }
    // MAIN USER DEPLACEMENTS
    mainPlayer.body.velocity.x = 0;
    mainPlayer.body.velocity.y = 0;
    if (cursors.left.isDown)
    {
        mainPlayer.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        mainPlayer.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
        mainPlayer.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        mainPlayer.body.velocity.y = 200;
    }
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
    var game = new Phaser.Game(
      800,
      600,
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

  // after first time
  componentDidUpdate () {

  }

  componentWillReceiveProps (nextProps) {
      // console.log('nextProps', nextProps)
      this.setState({ghostBuffer: nextProps.ghostBuffer})
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
  game: {layers, player}
}) {
  return {layers, player}
}

export default connect(
  mapStateToProps,
  {

  }
)(GameCanvas)

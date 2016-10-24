//
// MODULE
//
import React from 'react'
import {connect} from 'react-redux'

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
    game.load.image('mushroom', 'assets/sprites/mushroom2.png')
    game.load.image('ghost', 'assets/sprites/ghost-icon.png')
  }

  create () {
    const {game} = this.state
    const {layers} = this.props
    //  Modify the world and camera bounds
    game.world.setBounds(-50, -50, 2000, 2000)
    // RENDER EACH LAYER
    if (layers) {
      Object.keys(layers).forEach((layerName, index) => {
        const layer = layers[layerName]
        for (var y = 0; y < layer.matrix.length; y++) {
          for (var x = 0; x < layer.matrix[y].length; x++) {
            const element = layer.matrix[y][x]
            // DIRECTELY USE A TYPE PARAMETER LIKE THIS:
            // game.add.sprite(x, y, TYPE)
            if (element.val === 1) game.add.sprite(x * layer.cubeSize, y * layer.cubeSize, 'mushroom');
            else if (element.val === 2) {
              const newGhost = game.add.sprite(x * layer.cubeSize, y * layer.cubeSize, 'ghost')
              ghostsById[element.id] = newGhost
            }
          }
        }
      })
    }
    cursors = game.input.keyboard.createCursorKeys()
  }

  update () {
    if (buffer.length > 0) {
      const element = buffer.shift()
      if (element.type === 'ghost') {
        console.log('element --> ', element)
        ghostsById[element.id].x = element.x * 32
        ghostsById[element.id].y = element.y * 32
      }
    }
    const {game} = this.state
    if (cursors.up.isDown) game.camera.y -= 4;
    else if (cursors.down.isDown) game.camera.y += 4;
    if (cursors.left.isDown) game.camera.x -= 4;
    else if (cursors.right.isDown) game.camera.x += 4;
  }

  renderCanvas () {
    const {game} = this.state
    game.debug.cameraInfo(game.camera, 32, 32);
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
  game: {layers}
}) {
  return {layers}
}

export default connect(
  mapStateToProps,
  {

  }
)(GameCanvas)

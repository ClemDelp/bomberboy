//
// MODULE
//
import React from 'react'
import {connect} from 'react-redux'

//
// COMPONENT
//
class GameCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.create = this.create.bind(this)
    this.preload = this.preload.bind(this)
    this.update = this.update.bind(this)
    this.renderCanvas = this.renderCanvas.bind(this)
  }

  preload () {
    const {game} = this.state
    game.stage.backgroundColor = '#007236';
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('phaser', 'assets/sprites/phaser1.png');
  }

  create () {
    const {game} = this.state
    const {map} = this.props
    //  Modify the world and camera bounds
    game.world.setBounds(-1000, -1000, 2000, 2000);
    // build the map
    for (var y = 0; y < map.matrix.length; y++) {
      const row = map.matrix[y]
      for (var x = 0; x < row.length; x++) {
        if (row[x].val !== 0) game.add.sprite(x * map.cubeSize, y * map.cubeSize, 'mushroom');
      }
    }
    game.add.text(0, 0, "this text scrolls\nwith the background", { font: "32px Arial", fill: "#f26c4f", align: "center" });
    logo1 = game.add.sprite(0, 0, 'phaser');
    logo1.fixedToCamera = true;
    logo1.cameraOffset.setTo(100, 100);
    logo2 = game.add.sprite(0, 0, 'phaser');
    logo2.fixedToCamera = true;
    logo2.cameraOffset.setTo(500, 100);
    var t = game.add.text(0, 0, "this text is fixed to the camera", { font: "32px Arial", fill: "#ffffff", align: "center" });
    t.fixedToCamera = true;
    t.cameraOffset.setTo(200, 500);
    game.add.tween(logo2.cameraOffset).to( { y: 400 }, 2000, Phaser.Easing.Back.InOut, true, 0, 2000, true);
    cursors = game.input.keyboard.createCursorKeys()
  }

  update () {
    const {game} = this.state
    // console.log('mapWidth---->', this.props.map.width)
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
    this.setState({
      game: game
    })
  }

  // after first time
  componentDidUpdate () {

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
function mapStateToProps ({game: {map}}) {
  return {map}
}

export default connect(
  mapStateToProps,
  {

  }
)(GameCanvas)

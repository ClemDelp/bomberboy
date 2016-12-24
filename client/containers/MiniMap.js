//
// IMPORTS
//
import React from 'react'
import {connect} from 'react-redux'

//
// COMPONENTS
//
class MiniMap extends React.Component {
  constructor (props) {
    super()
  }
  fillTheCanvas () {
    const {matrix, pixelSize, width, height} = this.props
    if (matrix.length > 0) {
      // CONTEXT CANVAS
      const context = this.minimap.getContext('2d')
      // RESTE CANVAS
      context.clearRect(0, 0, width, height)
      // FILL CANVAS
      for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
          // COLOR
          const color = matrix[x][y].val.color
          context.fillStyle = color
          context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  }
  componentDidUpdate () {
    this.fillTheCanvas()
  }
  componentDidMount () {
    this.fillTheCanvas()
  }
  render () {
    const {width, height} = this.props
    return (
      <div>
        <center>
          <canvas
            width={width}
            height={height}
            ref={(minimap) => { this.minimap = minimap }}
          />
        </center>
      </div>
    )
  }
}

//
// EXPORT
//
function mapStateToProps ({game: {layers}}, ownProps) {
  let matrix = []
  if (layers.block && layers.block.matrix) matrix = layers.block.matrix
  return {
    matrix,
    width: ownProps.width,
    height: ownProps.height,
    pixelSize: ownProps.pixelSize
  }
}

export default connect(
  mapStateToProps,
  {}
)(MiniMap)

import React from 'react'
import {connect} from 'react-redux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import MiniMap from './MiniMap'

class DialogBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleOpen () {
    this.setState({open: true})
  }
  handleClose () {
    this.setState({open: false})
  }
  render () {
    const width = 100
    const height = 100
    return (
      <div>
        <RaisedButton
          style={{
            opacity: 0.7,
            position: 'absolute',
            top: 10,
            right: 10,
            minWidth: 0,
            padding: 0,
            margin: 0,
            height: height,
            width: width
          }}
          onTouchTap={this.handleOpen}
        >
          <MiniMap width={width} height={height} pixelSize='2' opacity='0.9' />
        </RaisedButton>
        <Dialog
          style={{
            opacity: '0.8'
          }}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <MiniMap width='500' height='500' pixelSize='10' opacity='0.9' />
        </Dialog>
      </div>
    )
  }
}

//
// EXPORT
//

export default connect()(DialogBox)

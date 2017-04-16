//
// IMPORTS
//

import React from 'react'
import { connect } from 'react-redux'
import GameCanvas from './GameCanvas'
import Chat from '../components/Chat'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Loading from '../components/Loading'
injectTapEventPlugin()

import DialogBox from './DialogBox'

//
// COMPONENT
//

const Index = ({layers}) => {
  return (
    <MuiThemeProvider>
      <div>
        <DialogBox />
        {
          Object.keys(layers).length > 0
          ? <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <GameCanvas />
              <Chat />
            </div>
          </div>
          : <Loading />
        }
      </div>
    </MuiThemeProvider>
  )
}

//
// CONNECT
//

function mapStateToProps ({game: {layers}}) {
  return {layers}
}

export default connect(
  mapStateToProps,
  null
)(Index)

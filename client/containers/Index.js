//
// IMPORTS
//

import React from 'react'
import { connect } from 'react-redux'
import GameCanvas from './GameCanvas'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Loading from '../components/Loading'
injectTapEventPlugin()

//
// COMPONENT
//

const Index = ({layers}) => {
  return (
    <MuiThemeProvider>
      <div>
      {
        Object.keys(layers).length > 0
        ? <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <GameCanvas />
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

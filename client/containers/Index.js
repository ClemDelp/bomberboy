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
  const styles = {
    header: {
      height: '10vh'
    },
    body: {
      height: '85vh',
      overflowY: 'auto'
    },
    footer: {
      height: '5vh'
    }
  }
  return (
    <MuiThemeProvider>
      <div style={{
        height: '100vh',
        width: '100vh'
      }}>
      {
        Object.keys(layers).length > 0
        ? <div className='row'>
            <div style={styles.body} className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
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

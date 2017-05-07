//
// IMPORTS
//
import React from 'react'
import {connect} from 'react-redux'
import LinearProgress from 'material-ui/LinearProgress'

//
// COMPONENTS
//
const Loading = () => {
  return (
    <div style={{marginTop: '40%'}}>
      <center>
        <div style={{width: '30%'}}>
          <h1>iso.io</h1>
          <LinearProgress mode="indeterminate" />
        </div>
      </center>
    </div>
  )
}

//
// EXPORT
//

export default connect()(Loading)

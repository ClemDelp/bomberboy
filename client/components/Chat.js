//
// IMPORTS
//

import React from 'react'
import {connect} from 'react-redux'
import {
  mergeIntoGameState,
  addGameAction
} from '../reducers/game'
import TextField from 'material-ui/TextField'

//
// COMPONENTS
//

class Chat extends React.Component {
  render () {
    const {
      chatInputValue,
      mergeIntoGameState,
      addGameAction,
      playerId
    } = this.props
    return (
      <div style={{
        position: 'absolute',
        bottom: 0,
        padding: '10px'
      }}>
        <TextField
          hintStyle={{color: 'gray'}}
          inputStyle={{color: 'white'}}
          hintText='say something...'
          onChange={(event, value) => mergeIntoGameState({chatInputValue: value})}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              addGameAction(
                playerId,
                {
                  type: 'chat',
                  value: chatInputValue,
                  elementId: playerId
                }
              )
              mergeIntoGameState({chatInputValue: ''})
            }
          }}
          value={chatInputValue}
        />
      </div>
    )
  }
}

//
// EXPORT
//

function mapStateToProps ({
  game: {
    chatInputValue,
    playerId
  }
}, ownProps) {
  return {
    chatInputValue,
    playerId
  }
}

export default connect(
  mapStateToProps,
  {
    mergeIntoGameState,
    addGameAction
  }
)(Chat)

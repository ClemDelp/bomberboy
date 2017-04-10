export function movementController (
  cursors,
  mainPlayer,
  mainPlayerObj,
  brodcastPlayerUpdate
) {
  // --------------------------------
  // Move the player at this speed.
  var speed = 200
  mainPlayer.body.velocity.x = 0
  mainPlayer.body.velocity.y = 0

  if (cursors.up.isDown && cursors.left.isDown) {
    movementAnimation(mainPlayer, 'top')
    mainPlayer.body.velocity.x = -speed
  }
  else if (cursors.up.isDown && cursors.right.isDown) {
    movementAnimation(mainPlayer, 'right')
    mainPlayer.body.velocity.y = -speed
    brodcastPlayerUpdate()
  }
  else if (cursors.down.isDown && cursors.left.isDown) {
    movementAnimation(mainPlayer, 'left')
    mainPlayer.body.velocity.y = speed
    brodcastPlayerUpdate()
  }
  else if (cursors.down.isDown && cursors.right.isDown) {
    movementAnimation(mainPlayer, 'right')
    mainPlayer.body.velocity.x = speed
    brodcastPlayerUpdate()
  }
  else if (cursors.up.isDown) {
    movementAnimation(mainPlayer, 'top')
    mainPlayer.body.velocity.x = -speed
    mainPlayer.body.velocity.y = -speed
    brodcastPlayerUpdate()
  }
  else if (cursors.down.isDown) {
    movementAnimation(mainPlayer, 'bottom')
    mainPlayer.body.velocity.x = speed
    mainPlayer.body.velocity.y = speed
    brodcastPlayerUpdate()
  }
  else if (cursors.left.isDown) {
      movementAnimation(mainPlayer, 'left')
      mainPlayer.body.velocity.x = -speed + 100
      mainPlayer.body.velocity.y = speed - 100
      brodcastPlayerUpdate()
  }
  else if (cursors.right.isDown) {
    movementAnimation(mainPlayer, 'right')
    mainPlayer.body.velocity.x = speed - 100
    mainPlayer.body.velocity.y = -speed + 100
    brodcastPlayerUpdate()
  }
  // Stop player animation
  if (
    mainPlayer.body.velocity.x === 0 &&
    mainPlayer.body.velocity.y === 0
  ) {
    movementAnimation(mainPlayer, 'stop')
    if (mainPlayerObj.orientation !== 'stop') brodcastPlayerUpdate()
  }

}

export function movementAnimation (sprite, orientation) {
  if (orientation === 'stop') sprite.animations.stop()
  sprite.animations.play(orientation)
  sprite.orientation = orientation
}

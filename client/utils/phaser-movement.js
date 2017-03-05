export function movementController (
  cursors,
  mainPlayer,
  updateMainPlayerObj
) {
  // --------------------------------
  // Move the player at this speed.
  var speed = 200
  mainPlayer.body.velocity.x = 0
  mainPlayer.body.velocity.y = 0

  if (cursors.up.isDown && cursors.left.isDown) {
    mainPlayer.animations.play('top')
    mainPlayer.body.velocity.x = -speed
    updateMainPlayerObj()
  }
  else if (cursors.up.isDown && cursors.right.isDown) {
    mainPlayer.animations.play('right')
    mainPlayer.body.velocity.y = -speed
    updateMainPlayerObj()
  }
  else if (cursors.down.isDown && cursors.left.isDown) {
    mainPlayer.animations.play('left')
    mainPlayer.body.velocity.y = speed
    updateMainPlayerObj()
  }
  else if (cursors.down.isDown && cursors.right.isDown) {
    mainPlayer.animations.play('right')
    mainPlayer.body.velocity.x = speed
    updateMainPlayerObj()
  }
  else if (cursors.up.isDown) {
    mainPlayer.animations.play('top')
    mainPlayer.body.velocity.x = -speed
    mainPlayer.body.velocity.y = -speed
    updateMainPlayerObj()
  }
  else if (cursors.down.isDown) {
    mainPlayer.animations.play('bottom')
    mainPlayer.body.velocity.x = speed
    mainPlayer.body.velocity.y = speed
    updateMainPlayerObj()
  }
  else if (cursors.left.isDown) {
      mainPlayer.animations.play('left')
      mainPlayer.body.velocity.x = -speed + 100
      mainPlayer.body.velocity.y = speed - 100
      updateMainPlayerObj()
  }
  else if (cursors.right.isDown) {
    mainPlayer.animations.play('right')
    mainPlayer.body.velocity.x = speed - 100
    mainPlayer.body.velocity.y = -speed + 100
    updateMainPlayerObj()
  }
  // Stop player animation
  if (
    mainPlayer.body.velocity.x === 0 &&
    mainPlayer.body.velocity.y === 0
  ) mainPlayer.animations.stop()
}

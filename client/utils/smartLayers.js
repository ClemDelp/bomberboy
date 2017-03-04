
export function getNewCoords(m1, m2) {
  const newCoords = []
  const indexedMatrix = {}
  // index the first matrix by xy
  m1.forEach((coord) => indexedMatrix[coord.x + '-' + coord.y] = coord)
  //
  m2.forEach((coord) => {
    if (indexedMatrix[coord.x + '-' + coord.y] === undefined) newCoords.push(coord)
  })
  return newCoords
}

export function print2DLayer (title, layer) {
  console.log(title)
  console.log('--------------')
  layer.forEach((row, i) => {
    console.log(row)
  })
  console.log('--------------')
}

export function getCoordsAround (target, sizeAround) {
  const coordsToLoad = []
  const origin = {
    x: target.x - sizeAround,
    y: target.y - sizeAround
  }
  for (var row = 0; row < ((sizeAround * 2) + 1); row++) {
    for (var col = 0; col < ((sizeAround * 2) + 1); col++) {
      const cA = {
        x: origin.x + row,
        y: origin.y + col
      }
      // console.log(cA)
      coordsToLoad.push(cA)
    }
  }
  return coordsToLoad
}

export function createLayer (matrixSize) {
  const layer = []
  for (var row = 0; row < matrixSize; row++) {
    layer[row] = []
    for (var col = 0; col < matrixSize; col++) {
      layer[row][col] = 0
    }
  }
  return layer
}

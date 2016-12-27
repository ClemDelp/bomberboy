export function mapLoading (delta, origin, matrix) {
  const params = {
    ox: origin.x,
    oy: origin.y,

    dx: delta.x,
    dy: delta.y,

    my: matrix.x,
    mx: matrix.y
  }

  let coordsToLoad = []

  if (params.dx === 0) coordsToLoad = A(params)
  else if (params.dy === 0) coordsToLoad = B(params)
  else coordsToLoad = A(params).concat(B(params))

  return coordsToLoad
}

function A (params) {
  const {ox, dy, mx, my} = params
  let coords = []
  const y = dy + my
  for (let i = ox; i < ox + mx; i++) {
    coords.push([i, y])
  }
  return coords
}

function B (params) {
  const {oy, dx, mx, my} = params

  let coords = []
  const x = dx + mx
  for (let i = oy; i < oy + my; i++) {
    coords.push([x, i])
  }
  return coords
}

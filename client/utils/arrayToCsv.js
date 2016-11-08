export function arrayToCsv (layer) {
  //  Create some map data dynamically
  //  Map size is layer.cols x layer.rows tiles
  var data = '';
  for (var y = 0; y < layer.rows; y++) {
      for (var x = 0; x < layer.cols; x++) {
          data += layer.matrix[y][x].val.toString()
          if (x < layer.cols - 1) data += ','
      }
      if (y < layer.rows - 1) data += "\n"
  }
  return data
}
